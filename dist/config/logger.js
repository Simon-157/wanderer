"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const config = {
    levels: { error: 0, warn: 1, info: 2, http: 3, debug: 4 },
    colors: {
        error: "red",
        warn: "yellow",
        info: "green",
        http: "cyan",
        debug: "white",
    },
};
(0, winston_1.addColors)(config.colors);
const transport = process.env.NODE_ENV !== "production"
    ? new winston_1.transports.Console()
    : new winston_1.transports.File({ filename: "server.log" });
const f = winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }), winston_1.format.colorize({ all: true }), winston_1.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`));
exports.logger = (0, winston_1.createLogger)({
    level: "debug",
    levels: config.levels,
    format: f,
    transports: [transport],
});
