import type { ModelSchema } from "@customTypes/model.type";

const rotationSchema: ModelSchema = {
  title: "rotation",
  bsonType: "object",
  properties: {
    startFrom: {
      bsonType: "string",
      description: "기원전 시작 년월",
    },
    endAt: {
      bsonType: "string",
      description: "기원전 종료 년월",
    },
    kor: {
      bsonType: "array",
      description: "카드 한글 데이터",
    },
    eng: {
      bsonType: "array",
      description: "카드 영어 데이터",
    },
    jpn: {
      bsonType: "array",
      description: "카드 일어 데이터",
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

export default rotationSchema;
