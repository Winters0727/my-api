import type { Request, Response } from "express";

import { getCollection } from "../../../database.js";

import { DEFAULT_LANG } from "../../constant/furuyoni.js";

import type { Language } from "@customTypes/furuyoni/index.type";
import type { CharacterName } from "@customTypes/furuyoni/character.type.js";

const getCardsHistorys = async (req: Request, res: Response) => {
  try {
    const character = req.query.char as CharacterName | undefined;
    const season = req.query.season as string | undefined;
    const lang = req.query.lang as Language | undefined;

    const historyCollection = getCollection("furuyoni", "history");

    const characterQuery = (character && character.toLowerCase()) || "";
    const seasonQuery = (season && season.toUpperCase()) || "";
    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;

    const historyProjection = {
      _id: 0,
      fullCode: 1,
      code: 1,
      character: 1,
      season: 1,
      name: `$${langQuery}Data.name`,
      type: `$${langQuery}Data.type`,
      subType: `$${langQuery}Data.subType`,
      category: `$${langQuery}Data.category`,
      description: `$${langQuery}Data.description`,
      imagePath: `$${langQuery}Data.imagePath`,
      distance: 1,
      damage: 1,
      enhancementCount: 1,
      cost: 1,
    };

    const searchQuery = characterQuery
      ? seasonQuery
        ? {
            character: characterQuery,
            season: seasonQuery,
          }
        : { character: characterQuery }
      : seasonQuery
      ? { season: seasonQuery }
      : {};

    const historys = await historyCollection
      .find(searchQuery)
      .project(historyProjection)
      .sort({ season: 1 })
      .toArray();

    return res.status(200).json({
      result: "success",
      historys,
      length: historys.length,
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

const getCardHistorys = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const character = req.query.char as CharacterName | undefined;
    const season = req.query.season as string | undefined;
    const lang = req.query.lang as Language | undefined;

    const historyCollection = getCollection("furuyoni", "history");

    const characterQuery = (character && character.toLowerCase()) || "";
    const seasonQuery = (season && season.toUpperCase()) || "";
    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;

    const historyProjection = {
      _id: 0,
      fullCode: 1,
      code: 1,
      character: 1,
      season: 1,
      name: `$${langQuery}Data.name`,
      type: `$${langQuery}Data.type`,
      subType: `$${langQuery}Data.subType`,
      category: `$${langQuery}Data.category`,
      description: `$${langQuery}Data.description`,
      imagePath: `$${langQuery}Data.imagePath`,
      distance: 1,
      damage: 1,
      enhancementCount: 1,
      cost: 1,
    };

    const searchQuery = characterQuery
      ? seasonQuery
        ? {
            character: characterQuery,
            season: seasonQuery,
          }
        : { character: characterQuery }
      : seasonQuery
      ? { season: seasonQuery }
      : {};

    if (code) {
      const historys = await historyCollection
        .find({
          ...searchQuery,
          fullCode: code,
        })
        .project(historyProjection)
        .sort({ season: 1 })
        .toArray();

      return res.status(200).json({
        result: "success",
        historys,
        length: historys.length,
      });
    }
    return res.status(404).json({
      result: "fail",
      error: "NotFound",
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

export { getCardsHistorys, getCardHistorys };
