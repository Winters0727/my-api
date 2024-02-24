import axios from "axios";
import type { Request, Response } from "express";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface TokenData {
  token: string;
  type: string;
  expiresAt: number;
}

const TOKEN_DATA: TokenData = {
  token: "",
  type: "",
  expiresAt: 0,
};

const getTwitchAccessToken = async (req: Request, res: Response) => {
  try {
    const { token, expiresAt } = TOKEN_DATA;
    const currentTime = Date.now();

    if (!token || currentTime < expiresAt - 60 * 1000) {
      const response = await axios.post<TokenResponse>(
        process.env.TWITCH_OAUTH_URL || "",
        null,
        {
          params: {
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_CLIENT_SECRET,
            grant_type: "client_credentials",
          },
        }
      );

      const { access_token, expires_in, token_type } = response.data;

      TOKEN_DATA.token = access_token;
      TOKEN_DATA.expiresAt = currentTime + expires_in;
      if (!TOKEN_DATA.type) TOKEN_DATA.type = token_type;
    }

    return res
      .status(200)
      .json({
        result: "success",
        token: TOKEN_DATA.token,
        type: TOKEN_DATA.type,
      });
  } catch (err: any) {
    return res.status(500).json({
      result: "fail",
      error: "Internal Server Error",
    });
  }
};

export { getTwitchAccessToken };
