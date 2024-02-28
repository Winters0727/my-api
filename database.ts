import { Document, MongoClient, ServerApiVersion } from "mongodb";

import FuruyoniDatabase from "./src/database/furuyoni.js";
import BlogDatabase from "./src/database/blog.js";

import { initializeMigration } from "./src/migration/furuyoni/index.migration.js";

import type { Db } from "mongodb";
import type { ModelSchema } from "./src/types/model.type";

interface CustomCollection {
  name: string;
  schema: ModelSchema;
}

interface CustomDatabase {
  name: string;
  collections: CustomCollection[];
}

interface Database {
  [dbName: string]: Db;
}

const DATABASE_URL = `${process.env.DATABASE_PREFIX}${process.env.DATABASE_ACCOUNT}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_SUFFIX}/${process.env.DATABASE_OPTIONS}`;

const client = new MongoClient(DATABASE_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    deprecationErrors: true,
  },
});

const database: Database = {};

const databaseList: CustomDatabase[] = [BlogDatabase, FuruyoniDatabase];

const getCollection = (dbName: string, name: string) =>
  database[dbName].collection(name);

const createCollection = async (database: Db, name: string, schema: Document) =>
  await database.createCollection(name, {
    validator: {
      $jsonSchema: schema,
    },
  });

const initializeCollection = async (
  database: Db,
  name: string,
  schema: Document
) => {
  const dbcollections = await database.collections();
  if (!dbcollections.some((document) => document.collectionName === name))
    await createCollection(database, name, schema);
};

const initializeDatabase = async (
  name: string,
  collections: CustomCollection[]
) => {
  const db = client.db(name);

  database[name] = db;

  for (const { name, schema } of collections) {
    await initializeCollection(db, name, schema);
  }
};

const initializeConnection = async () => {
  try {
    console.log("Attempt to connect database...");

    await client.connect();

    console.log("Database connection is accomplished!");

    console.log("Initializing collections...!");

    for (const { name, collections } of databaseList) {
      await initializeDatabase(name, collections);
    }

    await initializeMigration();

    console.log("Initialization is completed!");
  } catch (err: any) {
    await client.close();
    console.error(err);
  }
};

export { client, initializeConnection, getCollection };
