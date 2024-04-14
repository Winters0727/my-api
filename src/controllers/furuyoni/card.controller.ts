import type { Request, Response } from "express";

import { getCollection } from "../../../database.js";

import { DEFAULT_LANG } from "../../constant/furuyoni.js";

import { checkStringNumber } from "../..//utils/math.util.js";

import type { Language } from "@customTypes/furuyoni/index.type";
import type { CharacterMode } from "@customTypes/furuyoni/character.type";
import type { Card } from "@customTypes/furuyoni/card.type";

const DEFAULT_PER_PAGE = 20;

const sortCardsByType = ({
  cards,
  normalCards,
  specialCards,
  extraCards,
}: {
  cards: Card[];
  normalCards: string[];
  specialCards: string[];
  extraCards: string[];
}) => ({
  normalCards: cards.filter((card) => normalCards.includes(card.code)),
  specialCards: cards.filter((card) => specialCards.includes(card.code)),
  extraCards: cards.filter((card) => extraCards.includes(card.code)),
});

const getCardByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const lang = req.query.lang as Language | undefined;

    const cardCollection = getCollection("furuyoni", "card");

    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;

    const cardProjection = {
      _id: 0,
      fullCode: 1,
      code: 1,
      character: 1,
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
      e: {
        eType: "$eng.type",
        eSubType: "$eng.subType",
        eCategory: "$eng.category",
      },
    };

    const limitProjection = {
      _id: 0,
      limitAt: 1,
      season: "$limitInfo.season",
      for: `$limitInfo.${langQuery}.for`,
    };

    const card = (
      await cardCollection
        .aggregate([
          {
            $match: {
              fullCode: code,
            },
          },
          {
            $lookup: {
              from: "card",
              let: {
                character: "$character",
                relatedExtraCards: "$relatedExtraCards",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$character", "$$character"] },
                        { $in: ["$fullCode", "$$relatedExtraCards"] },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    fullCode: 1,
                    name: `$${langQuery}.name`,
                  },
                },
              ],
              as: "relatedExtraCards",
            },
          },
          {
            $project: cardProjection,
          },
        ])
        .toArray()
    )[0];

    if (card) {
      const historyCollection = getCollection("furuyoni", "history");
      const limitCollection = getCollection("furuyoni", "limit");

      const revision = (
        await historyCollection
          .find({ fullCode: card.fullCode })
          .project({ _id: 0, season: 1 })
          .sort({ season: 1 })
          .toArray()
      ).map((data) => data.season);

      const limitation = await limitCollection
        .aggregate([
          {
            $unwind: {
              path: "$limitInfo",
            },
          },
          {
            $match: {
              "limitInfo.fullCode": card.fullCode,
            },
          },
          {
            $project: limitProjection,
          },
        ])
        .toArray();

      return res.status(200).json({
        result: "success",
        card: { ...card, revision, limitation },
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

const getCardsByCharName = async (req: Request, res: Response) => {
  try {
    const { char: character } = req.params;
    const lang = req.query.lang as Language | undefined;
    const mode = req.query.mode as CharacterMode | undefined;

    const cardCollection = getCollection("furuyoni", "card");

    const characterCollection = getCollection("furuyoni", "character");
    const charData = await characterCollection.findOne({
      $or: [
        {
          "kor.name.O": {
            $eq: character,
          },
        },
        {
          "eng.name.O": {
            $eq: character.toLowerCase(),
          },
        },
        {
          "jpn.name.O": {
            $eq: character,
          },
        },
      ],
    });

    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;

    const cardProjection = {
      _id: 0,
      fullCode: 1,
      code: 1,
      character: 1,
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

    if (charData) {
      if (mode) {
        const modeUpperCase = mode.toUpperCase();

        if (charData && charData.mode.includes(modeUpperCase)) {
          const normalCards = charData.normalCards[modeUpperCase];
          const specialCards = charData.specialCards[modeUpperCase];
          const extraCards = charData.extraCards[modeUpperCase];

          const cards = await cardCollection
            .find({
              char: { $eq: charData.eng.name.O },
              $or: [
                { code: { $in: normalCards } },
                { code: { $in: specialCards } },
                { code: { $in: extraCards } },
              ],
            })
            .project<Card>({
              ...cardProjection,
            })
            .toArray();

          if (cards)
            return res.status(200).json({
              result: "success",
              cards: sortCardsByType({
                cards,
                normalCards,
                specialCards,
                extraCards,
              }),
            });
        }
      } else {
        const cards = await cardCollection
          .find({
            character: { $eq: charData.eng.name.O },
          })
          .project<Card>({
            ...cardProjection,
          })
          .toArray();

        const modes = charData.mode;

        const normalCards = modes
          .map((mode: CharacterMode) => charData.normalCards[mode])
          .flat();
        const specialCards = modes
          .map((mode: CharacterMode) => charData.specialCards[mode])
          .flat();
        const extraCards = modes
          .map((mode: CharacterMode) => charData.extraCards[mode])
          .flat();

        if (cards)
          return res.status(200).json({
            result: "success",
            cards: sortCardsByType({
              cards,
              normalCards,
              specialCards,
              extraCards,
            }),
          });
      }
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

const getCardsByKeyword = async (req: Request, res: Response) => {
  try {
    const lang = req.query.lang as Language | undefined;
    const keyword = req.query.keyword as string | undefined;
    const per = req.query.per as string | undefined;
    const page = req.query.page as string | undefined;

    const cardCollection = getCollection("furuyoni", "card");

    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;

    const cardProjection = {
      _id: 0,
      fullCode: 1,
      code: 1,
      character: 1,
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

    const perPage =
      (per && checkStringNumber(per) && parseInt(per)) || DEFAULT_PER_PAGE;
    const requestedPage =
      (page && checkStringNumber(page) && parseInt(page)) || 1;

    const totalCardCount = await cardCollection.countDocuments(
      keyword
        ? {
            $or: [
              {
                [`${langQuery}.name`]: {
                  $regex: keyword,
                  $options: "si",
                },
              },
              {
                [`${langQuery}.description`]: {
                  $regex: keyword,
                  $options: "si",
                },
              },
            ],
          }
        : {}
    );

    const totalPageCount = Math.ceil(totalCardCount / perPage);

    const currentPage =
      requestedPage < totalPageCount ? requestedPage : totalPageCount;

    const cardsFindCursor = cardCollection.find(
      keyword
        ? {
            $or: [
              // {
              //   [`${langQuery}.type`]: {
              //     $eq: keyword,
              //   },
              // },
              // {
              //   [`${langQuery}.subType`]: {
              //     $eq: keyword,
              //   },
              // },
              {
                [`${langQuery}.name`]: {
                  $regex: keyword,
                  $options: "si",
                },
              },
              {
                [`${langQuery}.description`]: {
                  $regex: keyword,
                  $options: "si",
                },
              },
            ],
          }
        : {}
    );

    if ((await cardsFindCursor.toArray()).length > 0) {
      await cardsFindCursor.close();
      const cards = await cardCollection
        .find(
          keyword
            ? {
                $or: [
                  {
                    [`${langQuery}.name`]: {
                      $regex: keyword,
                      $options: "si",
                    },
                  },
                  {
                    [`${langQuery}.description`]: {
                      $regex: keyword,
                      $options: "si",
                    },
                  },
                ],
              }
            : {}
        )
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .project(cardProjection)
        .toArray();

      if (cards)
        return res.status(200).json({
          result: "success",
          cards,
          currentPage,
          totalPage: totalPageCount,
          length: cards.length,
        });
    }

    return res.status(404).json({
      result: "fail",
      error: "Not Found",
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

export { getCardByCode, getCardsByCharName, getCardsByKeyword };
