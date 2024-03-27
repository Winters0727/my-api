import type { Request, Response } from "express";

import { getCollection } from "../../../database.js";

import { DEFAULT_LANG, DEFAULT_MODE } from "../../constant/furuyoni.js";

import type { Language } from "@customTypes/furuyoni/index.type";
import type {
  Character,
  CharacterMode,
} from "@customTypes/furuyoni/character.type";

const getCharacterList = async (req: Request, res: Response) => {
  try {
    const lang = req.query.lang as Language | undefined;
    const mode = req.query.mode as CharacterMode | undefined;

    const characterCollection = getCollection("furuyoni", "character");

    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;
    const modeQuery = (mode && mode.toUpperCase()) || DEFAULT_MODE;

    const langProjectionCondition = `$${langQuery}Data.name.${modeQuery}`;

    const characters: string[] = (
      await characterCollection
        .find()
        .project({
          _id: 0,
          name: langProjectionCondition,
        })
        .toArray()
    )
      .map((character) => character.name)
      .filter((name) => name);

    return res.status(200).json({
      result: "success",
      characters,
      length: characters.length,
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

const getCharacter = async (req: Request, res: Response) => {
  try {
    const { parameter } = req.params;
    const lang = req.query.lang as Language | undefined;
    const mode = req.query.mode as CharacterMode | undefined;

    const characterCollection = getCollection("furuyoni", "character");

    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;
    const modeQuery = (mode && mode.toUpperCase()) || DEFAULT_MODE;

    const cardProjection = {
      _id: 0,
      fullCode: 1,
      code: 1,
      name: `$${langQuery}Data.name`,
      type: `$${langQuery}Data.type`,
      subType: `$${langQuery}Data.subType`,
      category: `$${langQuery}Data.category`,
      description: `$${langQuery}Data.description`,
      imagePath: `$${langQuery}Data.imagePath`,
      relatedExtraCards: 1,
      revisionCount1: 1,
      distance: 1,
      damage: 1,
      deployCount: 1,
      cost: 1,
    };

    const character = (
      await characterCollection
        .aggregate<Character>([
          {
            $match: {
              $or: [
                {
                  "korData.name.O": {
                    $eq: parameter,
                  },
                },
                {
                  "engData.name.O": {
                    $eq: parameter.toLowerCase(),
                  },
                },
                {
                  "jpnData.name.O": {
                    $eq: parameter,
                  },
                },
              ],
            },
          },
          {
            $project: {
              _id: 0,
              name: `$${langQuery}Data.name.${modeQuery}`,
              imagePath: `$${langQuery}Data.imagePath.${modeQuery}`,
              abilityKeyword: `$${langQuery}Data.abilityKeyword`,
              abilityDescription: `$${langQuery}Data.abilityDescription`,
              symbolWeapon: `$${langQuery}Data.symbolWeapon`,
              symbolSub: `$${langQuery}Data.symbolSub.${modeQuery}`,
              code: 1,
              season: 1,
              dataSeason: 1,
              mode: modeQuery,
              normalCards: `$normalCards.${modeQuery}`,
              specialCards: `$specialCards.${modeQuery}`,
              extraCards: `$extraCards.${modeQuery}`,
            },
          },
          {
            $lookup: {
              from: "card",
              let: { normalCards: "$normalCards" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$character", parameter] },
                        { $in: ["$code", "$$normalCards"] },
                      ],
                    },
                  },
                },
                {
                  $project: cardProjection,
                },
              ],
              as: "normalCards",
            },
          },
          {
            $lookup: {
              from: "card",
              let: { specialCards: "$specialCards" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$character", parameter] },
                        { $in: ["$code", "$$specialCards"] },
                      ],
                    },
                  },
                },
                {
                  $project: cardProjection,
                },
              ],
              as: "specialCards",
            },
          },
          {
            $lookup: {
              from: "card",
              let: { extraCards: "$extraCards" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$character", parameter] },
                        { $in: ["$code", "$$extraCards"] },
                      ],
                    },
                  },
                },
                {
                  $project: cardProjection,
                },
              ],
              as: "extraCards",
            },
          },
        ])
        .toArray()
    )[0];

    if (character)
      return res.status(200).json({
        result: "success",
        character: character,
      });

    return res.status(404).json({
      result: "fail",
      error: "Not found",
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

export { getCharacterList, getCharacter };
