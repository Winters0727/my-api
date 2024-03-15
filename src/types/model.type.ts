export type Bson =
  | "array"
  | "date"
  | "double"
  | "binData"
  | "undefined"
  | "objectId"
  | "int"
  | "long"
  | "bool"
  | "string"
  | "timestamp"
  | "object"
  | "mixed";

export interface ModelSchema {
  bsonType: Bson;
  title?: string;
  required?: string[];
  properties: {
    [key: string]: {
      bsonType: Bson | Bson[];
      description: string;
    };
  };
}
