"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
require("dotenv/config");
exports.corsMiddleware = {
    origin: process.env.NODE_ENV == "production"
        ? process.env.CLIENT_URI_PROD
        : process.env.CLIENT_URI,
    credentials: true,
};
