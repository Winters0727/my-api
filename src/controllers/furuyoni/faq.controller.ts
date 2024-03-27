import type { Request, Response } from "express";

import { getCollection } from "../../../database.js";

const FAQ_MAX_COUNT = 20;

const createSearchQuery = (query: Request["query"]) => {
  const { category, keyword } = query;

  if (category)
    return {
      category: {
        $eq: category,
      },
      question: {
        $regex: keyword || "",
      },
    };

  return {
    question: {
      $regex: keyword || "",
    },
  };
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const faqCollection = getCollection("furuyoni", "faq");

    const category = await faqCollection.distinct("category");

    return res.status(200).json({
      result: "success",
      category,
      length: category.length,
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

const getFaqs = async (req: Request, res: Response) => {
  try {
    const { category, keyword } = req.query;

    const faqCollection = getCollection("furuyoni", "faq");

    const searchQuery = createSearchQuery({
      category,
      keyword,
    });

    if (category || keyword) {
      const faq = await faqCollection
        .find(searchQuery)
        .project({
          _id: 0,
          createdAt: 0,
          updatedAt: 0,
        })
        .limit(FAQ_MAX_COUNT)
        .toArray();

      if (faq.length > 0)
        return res.status(200).json({
          result: "success",
          faq,
          length: faq.length,
        });
      return res.status(404).json({
        result: "fail",
        error: "Not found",
      });
    }
    return res.status(404).json({
      result: "fail",
      error: "Keyword/Category is missing",
    });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

export { getCategories, getFaqs };
