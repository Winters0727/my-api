import type { ModelSchema } from "@customTypes/model.type";

const visitSchema: ModelSchema = {
  bsonType: "object",
  properties: {
    page: {
      bsonType: "string",
      description: "방문 페이지",
    },
    ip: {
      bsonType: "string",
      description: "방문자 ip",
    },
    userAgent: {
      bsonType: "string",
      description: "방문자 user-agent",
    },
    lastVisited: {
      bsonType: "date",
      description: "방문자 마지막 방문 날짜",
    },
  },
};

export default visitSchema;
