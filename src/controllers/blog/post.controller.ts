import { getCollection } from "../../../database.js";

import { ORIGIN_IP } from "../..//constant/index.js";

import type { Request, Response } from "express";
import type { Post } from "../../types/blog/index.type.js";

const getPostData = async (req: Request, res: Response) => {
  try {
    const ip = req.ip;
    const { slug } = req.params;

    if (slug && ip) {
      const postCollection = getCollection("blog", "post");

      const prePostData = await postCollection.findOne<Post>({ slug });

      if (!prePostData)
        await postCollection.insertOne({
          slug,
          views: 0,
          likes: [],
        });
      else
        await postCollection.findOneAndUpdate({ slug }, { $inc: { views: 1 } });

      const postData = await postCollection.findOne<Post>(
        { slug },
        {
          projection: {
            _id: 0,
            slug: 1,
            views: 1,
            likes: 1,
          },
        }
      );

      if (postData)
        return res.status(200).json({
          data: {
            ...postData,
            likes: postData.likes.length,
            isLike: postData.likes.includes(ip),
          },
        });
    }
    return res.status(404).json({
      result: "fail",
      error: "Not found",
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

const updatePostLikes = async (req: Request, res: Response) => {
  try {
    const ip = req.ip;
    const { slug } = req.params;

    if (slug && ip && ip !== ORIGIN_IP) {
      const postCollection = getCollection("blog", "post");

      const prePostData = await postCollection.findOne<Post>({ slug });

      if (prePostData) {
        const isLike = prePostData.likes.includes(ip);

        isLike
          ? await postCollection.updateOne({ slug }, { $pull: { likes: ip } })
          : await postCollection.updateOne({ slug }, { $push: { likes: ip } });

        const postData = await postCollection.findOne<Post>(
          { slug },
          {
            projection: {
              likes: 1,
            },
          }
        );

        if (postData)
          return res.status(200).json({
            result: "success",
            data: {
              likes: postData.likes.length,
              isLike: postData.likes.includes(ip),
            },
          });
      }
    }
    return res.status(404).json({
      result: "fail",
      error: "Not found",
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

export { getPostData, updatePostLikes };
