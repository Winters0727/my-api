import type { ModelSchema } from "@customTypes/model.type";

const commentSchema: ModelSchema = {
  title: "comment",
  required: [
    "slug",
    "name",
    "type",
    "content",
    "password",
    "ip",
    "isDeleted",
    "isSubComment",
    "createdAt",
    "updatedAt",
  ],
  bsonType: "object",
  properties: {
    parentId: {
      bsonType: "objectId",
      description: "포스트의 부모 댓글 ObjectId",
    },
    slug: {
      bsonType: "string",
      description: "포스트의 slug",
    },
    name: {
      bsonType: "string",
      description: "댓글 작성자 닉네임",
    },
    type: {
      bsonType: "string",
      description: "댓글 타입",
    },
    content: {
      bsonType: "string",
      description: "댓글 내용",
    },
    password: {
      bsonType: "string",
      description: "댓글 삭제 비밀번호",
    },
    ip: {
      bsonType: "string",
      description: "댓글 작성자 ip",
    },
    isDeleted: {
      bsonType: "bool",
      description: "댓글 삭제 여부",
    },
    deletedBy: {
      bsonType: "string",
      description: "댓글 삭제 이유",
    },
    isSubComment: {
      bsonType: "bool",
      description: "대댓글 여부",
    },
    subComments: {
      bsonType: "array",
      description: "대댓글 ObjectId 배열",
    },
    createdAt: {
      bsonType: "date",
      description: "댓글 생성 날짜",
    },
    updatedAt: {
      bsonType: "date",
      description: "댓글 변경 날짜",
    },
    deletedAt: {
      bsonType: "date",
      description: "댓글 삭제 날짜",
    },
  },
};

export default commentSchema;
