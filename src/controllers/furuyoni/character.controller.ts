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

    const langProjectionCondition = `$${langQuery}.name.${modeQuery}`;

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
    const { char } = req.params;
    const lang = req.query.lang as Language | undefined;
    const mode = req.query.mode as CharacterMode | undefined;

    const characterCollection = getCollection("furuyoni", "character");

    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;
    const modeQuery = (mode && mode.toUpperCase()) || DEFAULT_MODE;

    const cardProjection = {
      _id: 0,
      fullCode: 1,
      code: 1,
      name: `$${langQuery}.name`,
      type: `$${langQuery}.type`,
      subType: `$${langQuery}.subType`,
      category: `$${langQuery}.category`,
      description: `$${langQuery}.description`,
      imagePath: `$${langQuery}.imagePath`,
      relatedExtraCards: 1,
      revisionCount1: 1,
      distance: 1,
      damage: 1,
      enhancementCount: 1,
      cost: 1,
    };

    const character = (
      await characterCollection
        .aggregate<Character>([
          {
            $match: {
              $or: [
                {
                  "kor.name.O": {
                    $eq: char,
                  },
                },
                {
                  "eng.name.O": {
                    $eq: char.toLowerCase(),
                  },
                },
                {
                  "jpn.name.O": {
                    $eq: char,
                  },
                },
              ],
            },
          },
          {
            $project: {
              _id: 0,
              name: `$${langQuery}.name.${modeQuery}`,
              imagePath: `$${langQuery}.imagePath.${modeQuery}`,
              abilityKeyword: `$${langQuery}.abilityKeyword`,
              abilityDescription: `$${langQuery}.abilityDescription`,
              symbolWeapon: `$${langQuery}.symbolWeapon`,
              symbolSub: `$${langQuery}.symbolSub.${modeQuery}`,
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
                        { $eq: ["$character", char] },
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
                        { $eq: ["$character", char] },
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
                        { $eq: ["$character", char] },
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
