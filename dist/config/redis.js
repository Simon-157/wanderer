"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
require("dotenv/config");
const logger_1 = require("./logger");
const redisClient = new ioredis_1.default(process.env.REDIS_URI, {
    password: process.env.REDIS_PASSWORD,
});
exports.redisClient = redisClient;
redisClient.on("error", (err) => {
    logger_1.logger.log({ level: "error", message: `${err}` });
});
redisClient.on("ready", () => {
    logger_1.logger.log({ level: "info", message: "Connected to Redis instance" });
});
