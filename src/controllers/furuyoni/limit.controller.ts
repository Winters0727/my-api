import type { Request, Response } from "express";

import { getCollection } from "../../../database.js";

import { DEFAULT_LANG } from "../../constant/furuyoni.js";

import type { Language } from "@customTypes/furuyoni/index.type";

interface Limit {
  limitAt: string;
  limitInfo: {
    kor: {
      for: string;
    };
    eng: {
      for: string;
    };
    jpn: {
      for: string;
    };
  };
}

const getLimits = async (req: Request, res: Response) => {
  try {
    const date = req.query.date;
    const lang = req.query.lang as Language | undefined;

    const limitCollection = getCollection("furuyoni", "limit");

    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;

    const cardProjection = {
      _id: 0,
      code: 1,
      name: `$${langQuery}.name`,
      type: `$${langQuery}.type`,
      subType: `$${langQuery}.subType`,
      category: `$${langQuery}.category`,
      description: `$${langQuery}.description`,
      imagePath: `$${langQuery}.imagePath`,
      distance: 1,
      damage: 1,
      enhancementCount: 1,
      season: 1,
      cost: 1,
    };

    const limitProjection = {
      _id: 0,
      limitAt: 1,
      fullCode: "$limitInfo.fullCode",
      for: `$limitInfo.${langQuery}.for`,
      code: "$card.code",
      name: "$card.name",
      type: "$card.type",
      subType: "$card.subType",
      category: "$card.category",
      description: "$card.description",
      imagePath: "$card.imagePath",
      distance: "$card.distance",
      damage: "$card.damage",
      enhancementCount: "$card.enhancementCount",
      season: "$card.season",
      cost: "$card.cost",
      isRecent: 1,
    };

    const limitsFromCards = await limitCollection
      .aggregate(
        date
          ? [
              {
                $match: {
                  limitAt: date,
                },
              },
              {
                $unwind: {
                  path: "$limitInfo",
                },
              },
              {
                $match: {
                  "limitInfo.from": "card",
                },
              },
              {
                $lookup: {
                  from: "card",
                  let: { code: "$limitInfo.fullCode" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$fullCode", "$$code"],
                        },
                      },
                    },
                    {
                      $project: cardProjection,
                    },
                  ],
                  as: "card",
                },
              },
              {
                $unwind: {
                  path: "$card",
                },
              },
              {
                $addFields: {
                  isRecent: true,
                },
              },
              {
                $project: limitProjection,
              },
            ]
          : [
              {
                $unwind: {
                  path: "$limitInfo",
                },
              },
              {
                $match: {
                  "limitInfo.from": "card",
                },
              },
              {
                $lookup: {
                  from: "card",
                  let: { code: "$limitInfo.fullCode" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$fullCode", "$$code"],
                        },
                      },
                    },
                    {
                      $project: cardProjection,
                    },
                  ],
                  as: "card",
                },
              },
              {
                $unwind: {
                  path: "$card",
                },
              },
              {
                $addFields: {
                  isRecent: true,
                },
              },
              {
                $project: limitProjection,
              },
            ]
      )
      .toArray();

    const limitsFromHistories = await limitCollection
      .aggregate(
        date
          ? [
              {
                $match: {
                  limitAt: date,
                },
              },
              {
                $unwind: {
                  path: "$limitInfo",
                },
              },
              {
                $match: {
                  "limitInfo.from": "history",
                },
              },
              {
                $lookup: {
                  from: "history",
                  let: {
                    code: "$limitInfo.fullCode",
                    season: "$limitInfo.season",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$fullCode", "$$code"] },
                            { $eq: ["$season", "$$season"] },
                          ],
                        },
                      },
                    },
                    {
                      $project: cardProjection,
                    },
                  ],
                  as: "card",
                },
              },
              {
                $unwind: {
                  path: "$card",
                },
              },
              {
                $addFields: {
                  isRecent: false,
                },
              },
              {
                $project: limitProjection,
              },
            ]
          : [
              {
                $unwind: {
                  path: "$limitInfo",
                },
              },
              {
                $match: {
                  "limitInfo.from": "history",
                },
              },
              {
                $lookup: {
                  from: "history",
                  let: {
                    code: "$limitInfo.fullCode",
                    season: "$limitInfo.season",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$fullCode", "$$code"] },
                            { $eq: ["$season", "$$season"] },
                          ],
                        },
                      },
                    },
                    {
                      $project: cardProjection,
                    },
                  ],
                  as: "card",
                },
              },
              {
                $unwind: {
                  path: "$card",
                },
              },
              {
                $addFields: {
                  isRecent: false,
                },
              },
              {
                $project: limitProjection,
              },
            ]
      )
      .toArray();

    const limits = [...limitsFromCards, ...limitsFromHistories];

    return res.status(200).json({
      result: "success",
      limits,
      length: limits.length,
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

const getLimitDates = async (req: Request, res: Response) => {
  try {
    const limitCollection = getCollection("furuyoni", "limit");

    const dates = await limitCollection.distinct("limitAt");

    return res.status(200).json({
      result: "success",
      dates,
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

const getLimitByDate = async (req: Request, res: Response) => {
  try {
    const currentTime = new Date();
    const date =
      req.params.date ||
      `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    const lang = req.query.lang as Language | undefined;

    const limitCollection = getCollection("furuyoni", "limit");

    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;

    const limits = await limitCollection
      .aggregate([
        {
          $match: {
            limitAt: date,
          },
        },
        {
          $unwind: {
            path: "$limitInfo",
          },
        },
        {
          $project: {
            _id: 0,
            fullCode: "$limitInfo.fullCode",
            season: "$limitInfo.season",
            for: `$limitInfo.${langQuery}.for`,
          },
        },
      ])
      .toArray();

    return res.status(200).json({
      result: "success",
      limit: {
        limitAt: date,
        limits: limits,
      },
      length: limits.length,
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

export { getLimits, getLimitDates, getLimitByDate };
