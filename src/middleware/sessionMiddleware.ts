import RedisStore from "connect-redis";
import { redisClient } from "../config/redis";
import { Session, SessionOptions } from "express-session";

export const sessionMiddleware = {
  secret: process.env.SESSION_SECRET || "wanderer2024",
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({ client: redisClient }),
  cookie: {
    maxAge: 72 * 60 * 60 * 1000,
    httpOnly:true,
    secure: process.env.NODE_ENV == "production",
    sameSite: "none",

  },
} as SessionOptions;
