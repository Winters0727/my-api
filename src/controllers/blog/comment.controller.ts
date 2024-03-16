import { ObjectId } from "mongodb";
import { getCollection } from "../../../database.js";

import { hashPassword, comparePassword } from "../../utils/password.util.js";

import { ORIGIN_IP } from "../../constant/index.js";

import type { Request, Response } from "express";
import type {
  Comment,
  CommentPayload,
  DeleteCommentPayload,
} from "../../types/blog/index.type.js";

type BaseResponseComment = Exclude<Comment, "_id" | "password" | "ip">;

interface ResponseComment extends Omit<BaseResponseComment, "subComments"> {
  subComments: Comment[];
}

const maskingIp = (ip: string) =>
  [...ip.split(".").slice(0, 2), "*", "*"].join(".");

const postComment = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const payload = req.body as CommentPayload;
    const parentId = payload.parentId && new ObjectId(payload.parentId);

    const commentCollection = getCollection("blog", "comment");

    if (req.ip && req.ip !== ORIGIN_IP) {
      const currentDate = new Date();

      const commentData: Partial<Comment> = {
        slug: slug,
        name: payload.name,
        type: payload.type,
        content: payload.content,
        password: hashPassword(payload.password),
        ip: req.ip,
        isDeleted: false,
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      if (parentId) {
        commentData.isSubComment = true;

        const result = await commentCollection.insertOne(commentData);

        await commentCollection.updateOne(
          { _id: parentId },
          {
            $push: { subComments: result.insertedId },
          }
        );
      } else {
        commentData.isSubComment = false;
        commentData.subComments = [];

        await commentCollection.insertOne(commentData);
      }

      return res.status(201).json({ result: "success" });
    }
    return res.status(401).json({ result: "fail", error: "Unathorized" });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

const getComments = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const commentCollection = getCollection("blog", "comment");

    const data = [];

    const commentsData = await commentCollection
      .aggregate([
        {
          $match: {
            slug,
            isSubComment: false,
          },
        },
        {
          $lookup: {
            from: "comment",
            localField: "subComments",
            foreignField: "_id",
            as: "subComments",
            pipeline: [
              {
                $match: {
                  slug,
                },
              },
              {
                $project: {
                  slug: 0,
                  password: 0,
                },
              },
            ],
          },
        },
      ])
      .project<ResponseComment>({
        slug: 0,
        password: 0,
      })
      .toArray();

    for (const comment of commentsData) {
      comment.ip = maskingIp(comment.ip);
      comment.subComments = comment.subComments.map((subComment) => {
        subComment.ip = maskingIp(subComment.ip);
        return subComment.isDeleted
          ? { ...subComment, content: "삭제된 댓글입니다." }
          : subComment;
      });
      comment.isDeleted
        ? data.push({ ...comment, content: "삭제된 댓글입니다." })
        : data.push(comment);
    }

    return res.status(200).json({
      result: "success",
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { slug, id } = req.params;
    const { password } = req.body as DeleteCommentPayload;

    const commentCollection = getCollection("blog", "comment");

    const objectId = new ObjectId(id);

    const comment = await commentCollection.findOne({ slug, _id: objectId });

    if (comment) {
      if (comparePassword(password, comment.password)) {
        const currentDate = new Date();

        await commentCollection.findOneAndUpdate(
          {
            slug,
            _id: objectId,
          },
          {
            $set: {
              isDeleted: true,
              deletedBy: "User",
              updatedAt: currentDate,
              deletedAt: currentDate,
            },
          }
        );
        return res.status(200).json({ result: "success" });
      }
      return res
        .status(400)
        .json({ result: "fail", error: "Password not matched" });
    }
    return res.status(404).json({ result: "fail", error: "Comment not found" });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

export { postComment, getComments, deleteComment };
