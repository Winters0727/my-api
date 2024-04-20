import type { Request, Response } from "express";

import { getCollection } from "../../../database.js";

import { DEFAULT_LANG } from "../../constant/furuyoni.js";

import type { Language } from "@customTypes/furuyoni/index.type";

const getRotations = async (req: Request, res: Response) => {
  try {
    const lang = req.query.lang as Language | undefined;

    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;

    const rotationProjection = {
      _id: 0,
      startFrom: 1,
      endAt: 1,
      rotation: `$${langQuery}`,
    };

    const rotationCollection = getCollection("furuyoni", "rotation");

    const rotations = await rotationCollection
      .find()
      .project(rotationProjection)
      .toArray();

    return res.status(200).json({
      result: "success",
      rotations,
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

const getRecentRotation = async (req: Request, res: Response) => {
  try {
    const lang = req.query.lang as Language | undefined;

    const langQuery = (lang && lang.toLowerCase()) || DEFAULT_LANG;

    const rotationProjection = {
      _id: 0,
      startFrom: 1,
      endAt: 1,
      rotation: `$${langQuery}`,
    };

    const rotationCollection = getCollection("furuyoni", "rotation");

    const rotations = await rotationCollection
      .find()
      .sort({
        startFrom: -1,
      })
      .limit(1)
      .project(rotationProjection)
      .toArray();

    return res.status(200).json({
      result: "success",
      rotation: rotations[0],
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

export { getRotations, getRecentRotation };
