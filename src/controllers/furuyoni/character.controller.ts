import type { Request, Response } from "express";

import { getCollection } from "../../../database.js";

import { DEFAULT_LANG, DEFAULT_MODE } from "../../constant/furuyoni.js";

import type { Language } from "@customTypes/furuyoni/index.type";
import type {
  Character,
  CharacterMode,
} from "@customTypes/furuyoni/character.type";
import type { Card } from "@customTypes/furuyoni/card.type";

const CARD_EXCEPTION = ["NA-22-kiriko-O-S-4"];

const sortCards = (cards: Card[]) =>
  cards.sort(
    (prev, next) =>
      parseInt(prev.code[(prev.code.length as number) - 1]) -
      parseInt(next.code[(next.code.length as number) - 1])
  );

const getCharacterList = async (req: Request, res: Response) => {
  try {
    const lang = req.query.lang as Language | undefined;
    const mode = req.query.mode as CharacterMode | undefined;

    const characterCollection = getCollection("furuyoni", "character");

    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;
    const modeQuery = (mode && mode.toUpperCase()) || DEFAULT_MODE;

    const langProjectionCondition = `$${langQuery}.name${`.${modeQuery}`}`;

    const characters: string[] = (
      await characterCollection
        .find()
        .sort({
          code: 1,
        })
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

const getCharacterListWithModes = async (req: Request, res: Response) => {
  try {
    const lang = req.query.lang as Language | undefined;

    const characterCollection = getCollection("furuyoni", "character");

    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;

    const characters = (
      await characterCollection
        .aggregate([
          {
            $unwind: {
              path: "$mode",
            },
          },
          {
            $project: {
              _id: 0,
              code: 1,
              name: `$${langQuery}.name`,
              ename: `$eng.name.O`,
              mode: 1,
            },
          },
          {
            $sort: {
              code: 1,
            },
          },
        ])
        .toArray()
    ).map(({ code, name, ename, mode }) => ({
      code,
      name: name[mode],
      ename,
      mode,
    }));

    return res.status(200).json({
      result: "success",
      characters,
      length: characters.length,
    });
  } catch (err: any) {
    console.log(err);
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
    const detail = req.query.detail;

    const characterCollection = getCollection("furuyoni", "character");

    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;
    const modeQuery = (mode && mode.toUpperCase()) || "";

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
      distance: 1,
      damage: 1,
      enhancementCount: 1,
      cost: 1,
    };

    const characterProjection = {
      _id: 0,
      name: `$${langQuery}.name${modeQuery ? `.${modeQuery}` : ""}`,
      ename: `$eng.name.O`,
      imagePath: `$${langQuery}.imagePath${modeQuery ? `.${modeQuery}` : ""}`,
      abilityKeyword: `$${langQuery}.abilityKeyword`,
      abilityDescription: `$${langQuery}.abilityDescription`,
      symbolWeapon: `$${langQuery}.symbolWeapon`,
      symbolSub: `$${langQuery}.symbolSub${modeQuery ? `.${modeQuery}` : ""}`,
      code: 1,
      mode: modeQuery || 1,
      modes: "$mode",
      normalCards: modeQuery ? `$normalCards.${modeQuery}` : 1,
      specialCards: modeQuery ? `$specialCards.${modeQuery}` : 1,
      extraCards: modeQuery ? `$extraCards.${modeQuery}` : 1,
    };

    const character = (
      await characterCollection
        .aggregate<Character>(
          modeQuery && detail === "true"
            ? [
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
                  $project: characterProjection,
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
              ]
            : [
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
                  $project: characterProjection,
                },
              ]
        )
        .toArray()
    )[0];

    if (character) {
      if (detail === "true") {
        const { normalCards, specialCards } = character;

        [(normalCards as Card[], specialCards as Card[])].forEach(
          (cards: Card[]) => {
            sortCards(cards);
          }
        );

        // TODO: 위에서 renri 카드에 왜 키리코 카드가 포함되는지 나중에 수정해야 함
        if (char === "renri" && detail)
          character.specialCards = character.specialCards.filter(
            (card) => !CARD_EXCEPTION.includes((card as Card).fullCode)
          ) as Card[];
      }

      return res.status(200).json({
        result: "success",
        character: character,
      });
    }
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

export { getCharacterList, getCharacterListWithModes, getCharacter };
