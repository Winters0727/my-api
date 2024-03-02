import type { ModelSchema } from "@customTypes/model.type";

const visitSchema: ModelSchema = {
  bsonType: "object",
  properties: {
    page: {
      bsonType: "string",
      description: "방문 페이지",
    },
    id: {
      bsonType: "string",
      description: "방문자 ip",
    },
    lastVisited: {
      bsonType: "date",
      description: "방문자 마지막 방문 날짜",
    },
  },
};

export default visitSchema;
