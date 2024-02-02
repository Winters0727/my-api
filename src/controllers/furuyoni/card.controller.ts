import type { Request, Response } from "express";
import type { Document } from "mongodb";

import { getCollection } from "../../../database.js";

import type { Language } from "@customTypes/furuyoni/index.type";
import type { CharacterMode } from "@customTypes/furuyoni/character.type";
import type { Card } from "@customTypes/furuyoni/card.type";

const DEFAULT_LANG = "kor";

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
    const charName = req.query.character as string | undefined;
    const lang = req.query.lang as Language | undefined;

    const cardCollection = getCollection("furuyoni", "card");

    if (charName) {
      const card = await cardCollection.findOne(
        {
          charName: charName.toLowerCase(),
          code: { $eq: code },
        },
        {
          projection: {
            _id: 0,
            fullCode: 1,
            code: 1,
            charName: 1,
            data: `$${(lang && lang.toLowerCase()) || DEFAULT_LANG}Data`,
            relatedExtraCards: 1,
            revisionCount1: 1,
            distance: 1,
            shieldDamage: 1,
            hpDamage: 1,
            deployCount: 1,
            cost: 1,
          },
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
          projection: {
            _id: 0,
            fullCode: 1,
            code: 1,
            charName: 1,
            data: `$${(lang && lang.toLowerCase()) || DEFAULT_LANG}Data`,
            relatedExtraCards: 1,
            revisionCount1: 1,
            distance: 1,
            shieldDamage: 1,
            hpDamage: 1,
            deployCount: 1,
            cost: 1,
          },
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
    const { charName } = req.params;
    const lang = req.query.lang as Language | undefined;
    const mode = req.query.mode as CharacterMode | undefined;

    const cardCollection = getCollection("furuyoni", "card");

    const characterCollection = getCollection("furuyoni", "character");
    const charData = await characterCollection.findOne({
      $or: [
        {
          "korData.name.O": {
            $eq: charName,
          },
        },
        {
          "engData.name.O": {
            $eq: charName.toLowerCase(),
          },
        },
        {
          "jpnData.name.O": {
            $eq: charName,
          },
        },
      ],
    });

    if (charData) {
      if (mode) {
        const modeUpperCase = mode.toUpperCase();

        if (charData && charData.mode.includes(modeUpperCase)) {
          const normalCards = charData.normalCards[modeUpperCase];
          const specialCards = charData.specialCards[modeUpperCase];
          const extraCards = charData.extraCards[modeUpperCase];

          const cards = await cardCollection
            .find({
              charName: { $eq: charData.engData.name.O },
              $or: [
                { code: { $in: normalCards } },
                { code: { $in: specialCards } },
                { code: { $in: extraCards } },
              ],
            })
            .project<Card>({
              _id: 0,
              fullCode: 1,
              code: 1,
              charName: 1,
              data: `$${(lang && lang.toLowerCase()) || DEFAULT_LANG}Data`,
              relatedExtraCards: 1,
              revisionCount1: 1,
              distance: 1,
              shieldDamage: 1,
              hpDamage: 1,
              deployCount: 1,
              cost: 1,
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
            charName: { $eq: charData.engData.name.O },
          })
          .project<Card>({
            _id: 0,
            fullCode: 1,
            code: 1,
            charName: 1,
            data: `$${(lang && lang.toLowerCase()) || DEFAULT_LANG}Data`,
            relatedExtraCards: 1,
            revisionCount1: 1,
            distance: 1,
            shieldDamage: 1,
            hpDamage: 1,
            deployCount: 1,
            cost: 1,
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
