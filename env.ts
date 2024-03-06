import path from "path";
import dotenv from "dotenv";

if (process.env.ENV !== "development") process.env.TZ = "Asia/Seoul";

export default dotenv.config({
  path:
    process.env.NODE_ENV === "development"
      ? path.resolve(process.cwd(), ".env.development")
      : path.resolve(process.cwd(), ".env.production"),
});
