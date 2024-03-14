import { getCollection } from "../../../database.js";

import { ORIGIN_IP } from "../../constant/index.js";

import type { Request, Response } from "express";

let prevDate = new Date();

const getDate = (date: Date) =>
  new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);

const getVisitData = async (req: Request, res: Response) => {
  try {
    const ip = req.ip;

    const indexCollection = getCollection("blog", "index");
    const visitCollection = getCollection("blog", "visit");

    const preIndexData = await indexCollection.findOne({ page: "blog" });

    if (!preIndexData)
      await indexCollection.insertOne({ page: "blog", today: 0, total: 0 });

    const currentDate = new Date();

    if (currentDate.getDate() !== prevDate.getDate()) {
      prevDate = getDate(currentDate);
      await indexCollection.findOneAndUpdate(
        { page: "blog" },
        { $set: { today: 0 } }
      );
    }

    if (ip !== ORIGIN_IP) {
      const visitorData = await visitCollection.findOne({ ip });

      if (!visitorData) {
        await visitCollection.insertOne({ ip, lastVisited: currentDate });
        await indexCollection.findOneAndUpdate(
          { page: "blog" },
          { $inc: { today: 1, total: 1 } }
        );
      } else {
        const lastVisited = new Date(visitorData.lastVisited);

        if (currentDate.getDate() !== lastVisited.getDate()) {
          await indexCollection.findOneAndUpdate(
            { page: "blog" },
            { $inc: { today: 1, total: 1 } }
          );
        }

        await visitCollection.findOneAndUpdate(
          { ip },
          { $set: { lastVisited: currentDate } }
        );
      }
    }

    const data = await indexCollection.findOne(
      { page: "blog" },
      {
        projection: { _id: 0, today: 1, total: 1 },
      }
    );

    return res.status(200).json({ result: "success", data });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

export { getVisitData };
