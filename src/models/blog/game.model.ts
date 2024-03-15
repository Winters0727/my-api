import type { ModelSchema } from "@customTypes/model.type";

const gameSchema: ModelSchema = {
  title: "game",
  bsonType: "object",
  properties: {
    id: {
      bsonType: "int",
      description: "게임 id",
    },
    aggregated_rating: {
      bsonType: ["double", "int"],
      description: "게임 평점 평균",
    },
    artworks: {
      bsonType: "array",
      description: "게임 아트워크 이미지 데이터",
    },
    cover: {
      bsonType: "object",
      description: "게임 커머 이미지 데이터",
    },
    first_release_date: {
      bsonType: "date",
      description: "게임 출시일",
    },
    rating: {
      bsonType: ["double", "int"],
      description: "게임 평점",
    },
    screenshots: {
      bsonType: "array",
      description: "게임",
    },
    total_rating: {
      bsonType: ["double", "int"],
      description: "게임 전체 평점",
    },
    videos: {
      bsonType: "array",
      description: "게임 영상 데이터 (from Youtube)",
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

export default gameSchema;
