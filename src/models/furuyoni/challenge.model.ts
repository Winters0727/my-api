import type { ModelSchema } from "@customTypes/model.type";

const ChallengeSchema: ModelSchema = {
  title: "challenge",
  bsonType: "object",
  properties: {
    code: {
      bsonType: "string",
      description: "캐릭터 코드",
    },
    charName: {
      bsonType: "string",
      description: "캐릭터 이름(영어)",
    },
    korData: {
      bsonType: "object",
      description: "여신에게 도전 한글 데이터",
    },
    engData: {
      bsonType: "object",
      description: "여신에게 도전 영어 데이터",
    },
    jpnData: {
      bsonType: "object",
      description: "여신에게 도전 일어 데이터",
    },
    additionalCards: {
      bsonType: "object",
      description: "여신에게 도전 시 안전구축에 추가되는 카드",
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

export default ChallengeSchema;
