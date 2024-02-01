import type { Request, Response } from "express";

import { getCollection } from "../../../database.ts";

import type { Language } from "@customTypes/furuyoni/index.type.ts";
import type { CharacterMode } from "@customTypes/furuyoni/character.type.ts";

const DEFAULT_LANG = "kor";

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

    if (mode) {
      const characterCollection = getCollection("furuyoni", "character");
      const charData = await characterCollection.findOne({
        "engData.name.O": { $eq: charName },
      });

      const modeUpperCase = mode.toUpperCase();

      if (charData && charData.mode.includes(modeUpperCase)) {
        const modeNormalCards = charData.normalCards[modeUpperCase];
        const modeSpecialCards = charData.specialCards[modeUpperCase];

        const cards = await cardCollection
          .find({
            charName: { $eq: charName },
            $or: [
              { code: { $in: modeNormalCards } },
              { code: { $in: modeSpecialCards } },
            ],
          })
          .project({
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
            cards,
          });
      }
    } else {
      const cards = await cardCollection
        .find({
          charName: { $eq: charName },
        })
        .project({
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
          cards,
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

export { getCardByCode, getCardsByCharName };
