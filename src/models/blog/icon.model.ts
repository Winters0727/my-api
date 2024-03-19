import type { ModelSchema } from "@customTypes/model.type";

const iconSchema: ModelSchema = {
  title: "index",
  required: ["name", "fileName", "path"],
  bsonType: "object",
  properties: {
    name: {
      bsonType: "string",
      description: "이모티콘 이름",
    },
    fileName: {
      bsonType: "string",
      description: "이모티콘 파일명",
    },
    path: {
      bsonType: "string",
      description: "이모티콘 경로",
    },
  },
};

export default iconSchema;
