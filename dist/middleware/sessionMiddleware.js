"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const connect_redis_1 = __importDefault(require("connect-redis"));
const redis_1 = require("../config/redis");
exports.sessionMiddleware = {
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: new connect_redis_1.default({ client: redis_1.redisClient }),
    cookie: {
        maxAge: 72 * 60 * 60 * 1000,
    },
};
