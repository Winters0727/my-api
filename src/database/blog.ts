import gameSchema from "../models/blog/game.model.js";

export default {
  name: "blog",
  collections: [
    {
      name: "game",
      schema: gameSchema,
    },
  ],
};
