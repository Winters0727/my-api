import axios from "axios";

import { getCollection } from "../../../database.js";

import { GAME_DATA_UPDATE_TERM } from "../../constant/index.js";

import type { Request, Response } from "express";
import type {
  TokenData,
  TokenResponse,
  GameResponse,
  GameApiResponse,
} from "@customTypes/blog/index.type.js";

const BASE_URL = `${process.env.TWITCH_API_URL}/${process.env.TWITCH_API_VERSION}`;

const FIELDS = [
  "aggregated_rating",
  "first_release_date",
  "rating",
  "total_rating",
];

const NESTED_FIELDS = ["artworks", "cover", "screenshots", "videos"].map(
  (field) => `${field}.*`
);

const TOKEN_DATA: TokenData = {
  token: "",
  type: "",
  expiresAt: 0,
};

const fieldsString = [...FIELDS, ...NESTED_FIELDS].join(",");

const convertImageSize = (url: string, size: string) =>
  url.replace("t_thumb", `t_${size}`);

const updateTwitchAccessToken = async (currentTime: number) => {
  try {
    const response = await axios.post<TokenResponse>(
      process.env.TWITCH_OAUTH_URL || "",
      null,
      {
        params: {
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
          grant_type: "client_credentials",
        },
      }
    );

    const { access_token, expires_in, token_type } = response.data;

    TOKEN_DATA.token = access_token;
    TOKEN_DATA.expiresAt = currentTime + expires_in;
    if (!TOKEN_DATA.type) TOKEN_DATA.type = token_type;

    return true;
  } catch (err: any) {
    return false;
  }
};

const fetchGameData = async (id: string) => {
  const currentTime = Date.now();

  if (!TOKEN_DATA.token || currentTime < TOKEN_DATA.expiresAt - 60 * 1000)
    await updateTwitchAccessToken(currentTime);

  const rawQueryString = `fields ${fieldsString}; where id=${id};`;

  const response = await axios.post<GameResponse[]>(
    `${BASE_URL}/games`,
    rawQueryString,
    {
      headers: {
        Accept: "application/json",
        Authorization: `bearer ${TOKEN_DATA.token}`,
        "Content-Type": "text/plain",
        "Client-ID": process.env.TWITCH_CLIENT_ID,
      },
    }
  );

  const resData = response.data[0];

  const data: GameApiResponse = {
    id: resData.id,
    aggregated_rating: resData.aggregated_rating,
    first_release_date: new Date(resData.first_release_date * 1000),
    rating: resData.rating,
    total_rating: resData.total_rating,
  };

  data.artworks = resData.artworks.map((artwork) => ({
    width: artwork.width,
    height: artwork.height,
    image_id: artwork.image_id,
    url: convertImageSize(artwork.url, "1080p"),
  }));

  data.cover = {
    width: resData.cover.width,
    height: resData.cover.height,
    image_id: resData.cover.image_id,
    url: convertImageSize(resData.cover.url, "1080p"),
  };

  data.screenshots = resData.screenshots.map((screenshot) => ({
    width: screenshot.width,
    height: screenshot.height,
    image_id: screenshot.image_id,
    url: convertImageSize(screenshot.url, "1080p"),
  }));

  data.videos = resData.videos.map((video) => ({
    name: video.name,
    video_id: video.video_id,
    url: `//youtube.com/watch?v=${video.video_id}`,
  }));

  return data;
};

const getGameData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const gameCollection = getCollection("blog", "game");

    const isIndexExist = await gameCollection.indexExists("id");

    if (!isIndexExist)
      await gameCollection.createIndex({ id: 1 }, { unique: true });

    const game = await gameCollection.findOne({
      id: {
        $eq: parseInt(id, 10),
      },
    });

    if (!game) {
      const currentTime = new Date();
      const fetchedData = await fetchGameData(id);
      await gameCollection.insertOne({
        ...fetchedData,
        aggregated_rating: fetchedData.aggregated_rating || -1,
        updatedAt: currentTime,
        createdAt: currentTime,
      });
    } else {
      const currentTime = Date.now();
      const updatedTime = new Date(game.updatedAt).getTime();

      if (currentTime - updatedTime > GAME_DATA_UPDATE_TERM) {
        const fetchedData = await fetchGameData(id);
        await gameCollection.findOneAndUpdate(
          { id: { $eq: parseInt(id, 10) } },
          {
            $set: {
              ...fetchedData,
              aggregated_rating: fetchedData.aggregated_rating || -1,
              createdAt: game.createdAt,
              updatedAt: new Date(currentTime),
            },
          }
        );
      }
    }

    const data = await gameCollection.findOne(
      {
        id: {
          $eq: parseInt(id, 10),
        },
      },
      {
        projection: {
          _id: 0,
          updatedAt: 0,
          createdAt: 0,
        },
      }
    );

    return res.status(200).json({ data });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

export { getGameData };
