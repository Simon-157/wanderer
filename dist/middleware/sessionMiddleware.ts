import RedisStore from "connect-redis";
import { redisClient } from "../config/redis";
import { Session, SessionOptions } from "express-session";

export const sessionMiddleware = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({ client: redisClient }),
  cookie: {
    maxAge: 72 * 60 * 60 * 1000,
  },
} as SessionOptions;


