import indexSchema from '../models/furuyoni/index.model.ts';
import CharacterSchema from '../models/furuyoni/character.model.ts';
import FaqSchema from '../models/furuyoni/faq.model.ts';
import CardSchema from '../models/furuyoni/card.model.ts';

export default {
  name: 'furuyoni',
  collections: [
    {
      name: 'index',
      schema: indexSchema,
    },
    {
      name: 'character',
      schema: CharacterSchema,
    },
    {
      name: 'card',
      schema: CardSchema,
    },
    {
      name: 'faq',
      schema: FaqSchema,
    },
  ],
};
