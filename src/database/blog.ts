import indexSchema from "../models/blog/index.model.js";
import postSchema from "../models/blog/post.model.js";
import gameSchema from "../models/blog/game.model.js";
import visitSchema from "../models/blog/visit.model.js";

export default {
  name: "blog",
  collections: [
    {
      name: "index",
      schema: indexSchema,
    },
    {
      name: "post",
      schema: postSchema,
    },
    {
      name: "game",
      schema: gameSchema,
    },
    {
      name: "visit",
      schema: visitSchema,
    },
  ],
};
