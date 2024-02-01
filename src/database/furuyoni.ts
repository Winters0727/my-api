import indexSchema from "../models/furuyoni/index.model.js";
import CharacterSchema from "../models/furuyoni/character.model.js";
import FaqSchema from "../models/furuyoni/faq.model.js";
import CardSchema from "../models/furuyoni/card.model.js";

export default {
  name: "furuyoni",
  collections: [
    {
      name: "index",
      schema: indexSchema,
    },
    {
      name: "character",
      schema: CharacterSchema,
    },
    {
      name: "card",
      schema: CardSchema,
    },
    {
      name: "faq",
      schema: FaqSchema,
    },
  ],
};
