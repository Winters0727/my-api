import type { ModelSchema } from "@customTypes/model.type";

const CardSchema: ModelSchema = {
  title: "card",
  bsonType: "object",
  properties: {
    fullCode: {
      bsonType: "string",
      description: "카드 전체 코드",
    },
    code: {
      bsonType: "string",
      description: "카드 코드",
    },
    charName: {
      bsonType: "string",
      description: "카드 캐릭터 이름(영어)",
    },
    kor: {
      bsonType: "object",
      description: "카드 한글 데이터",
    },
    eng: {
      bsonType: "object",
      description: "카드 영어 데이터",
    },
    jpn: {
      bsonType: "object",
      description: "카드 일어 데이터",
    },
    relatedExtraCards: {
      bsonType: "array",
      description: "카드 관련 추가 카드 배열",
    },
    revisionCount: {
      bsonType: "int",
      description: "카드 수정 횟수",
    },
    distance: {
      bsonType: "string",
      description: "공격패 적정거리",
    },
    damage: {
      bsonType: "string",
      description: "공격패 데미지",
    },
    enhancementCount: {
      bsonType: "string",
      description: "부여패 봉납 수",
    },
    cost: {
      bsonType: "string",
      description: "비장패 비용",
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

export default CardSchema;
