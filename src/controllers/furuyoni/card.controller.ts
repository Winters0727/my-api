import type { Request, Response } from "express";

import { getCollection } from "../../../database.js";

import { DEFAULT_LANG } from "../../constant/furuyoni.js";

import type { Language } from "@customTypes/furuyoni/index.type";
import type { CharacterMode } from "@customTypes/furuyoni/character.type";
import type { Card } from "@customTypes/furuyoni/card.type";

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
    const character = req.query.char as string | undefined;
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
      revisionCount1: 1,
      distance: 1,
      damage: 1,
      enhancementCount: 1,
      cost: 1,
    };

    if (character) {
      const card = await cardCollection.findOne(
        {
          char: character.toLowerCase(),
          code: { $eq: code },
        },
        {
          projection: cardProjection,
        }
      );

      if (card)
        return res.status(200).json({
          result: "success",
          card,
        });
    } else {
      const card = await cardCollection.findOne(
        {
          fullCode: { $eq: code },
        },
        {
          projection: cardProjection,
        }
      );

      if (card)
        return res.status(200).json({
          result: "success",
          card,
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
      revisionCount1: 1,
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

export { getCardByCode, getCardsByCharName };
