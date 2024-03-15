import type { ModelSchema } from "@customTypes/model.type";

const postSchema: ModelSchema = {
  title: "post",
  required: ["slug", "views", "likes"],
  bsonType: "object",
  properties: {
    slug: {
      bsonType: "string",
      description: "Post 슬러그",
    },
    views: {
      bsonType: "int",
      description: "Post 조회 수",
    },
    likes: {
      bsonType: "array",
      description: "Post 좋아요 수",
    },
  },
};

export default postSchema;
