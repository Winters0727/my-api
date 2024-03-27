import type { ModelSchema } from "@customTypes/model.type";

const UpdateSchema: ModelSchema = {
  title: "update",
  bsonType: "object",
  properties: {
    fullCode: {
      bsonType: "string",
      description: "카드 전체 코드",
    },
    season: {
      bsonType: "string",
      description: "카드 변경 시즌",
    },
    code: {
      bsonType: "string",
      description: "카드 코드",
    },
    charName: {
      bsonType: "string",
      description: "카드 캐릭터 이름(영어)",
    },
    korData: {
      bsonType: "object",
      description: "카드 한글 데이터",
    },
    engData: {
      bsonType: "object",
      description: "카드 영어 데이터",
    },
    jpnData: {
      bsonType: "object",
      description: "카드 일어 데이터",
    },
    distance: {
      bsonType: "string",
      description: "공격패 적정거리",
    },
    damage: {
      bsonType: "string",
      description: "공격패 데미지",
    },
    deployCount: {
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

export default UpdateSchema;
