import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";

import "./env.ts";
import { initializeConnection } from "./database.ts";

import ApiRouter from "@routes/api.ts";

const app = express();

app.set("trust proxy", true);
app.use(
  cors({
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "winters",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  })
);

app.use(bodyParser.json());

app.use("/api", ApiRouter);

app.listen(
  process.env.PORT ? parseInt(process.env.PORT) : 3000,
  "0.0.0.0",
  () => {
    initializeConnection();
    console.log("App is running...");
  }
);
