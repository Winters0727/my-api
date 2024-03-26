import express from "express";
import session from "express-session";
import bodyParser from "body-parser";

import "./env.js";
import { initializeConnection } from "./database.js";

import ApiRouter from "./src/routes/api.js";

const app = express();

app.set("trust proxy", true);

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

app.use("/blog/images", express.static("public/blog/images"));
app.use("/furuyoni/images", express.static("public/furuyoni/images"));

app.use("", ApiRouter);

app.listen(
  process.env.PORT ? parseInt(process.env.PORT) : 3000,
  "0.0.0.0",
  () => {
    initializeConnection();
    console.log("App is running...");
  }
);
