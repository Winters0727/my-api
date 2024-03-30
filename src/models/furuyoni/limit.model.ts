import type { ModelSchema } from "@customTypes/model.type";

const limitSchema: ModelSchema = {
  title: "rotation",
  bsonType: "object",
  properties: {
    limitAt: {
      bsonType: "string",
      description: "금제 년월",
    },
    limitInfo: {
      bsonType: "array",
      description: "금제 데이터 배열",
    },
    createdAt: {
      bsonType: "date",
      description: "데이터 생성 날짜",
    },
    updatedAt: {
      bsonType: "date",
      description: "데이터 수정 날짜",
    },
  },
};

export default limitSchema;
