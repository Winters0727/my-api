import { getCollection } from "../../../database.js";

import type { Request, Response } from "express";

const getIcons = async (req: Request, res: Response) => {
  try {
    const iconCollection = getCollection("blog", "icon");

    const data = await iconCollection
      .find({}, { projection: { _id: 0 } })
      .toArray();

    return res.status(200).json({ result: "success", data });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

export { getIcons };
