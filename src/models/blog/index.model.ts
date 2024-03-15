import type { ModelSchema } from "@customTypes/model.type";

const indexSchema: ModelSchema = {
  title: "index",
  required: ["page", "today", "total"],
  bsonType: "object",
  properties: {
    page: {
      bsonType: "string",
      description: "방문 페이지",
    },
    today: {
      bsonType: "int",
      description: "오늘 방문자 수",
    },
    total: {
      bsonType: "int",
      description: "전체 방문자 수",
    },
  },
};

export default indexSchema;
