"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const logger_1 = require("../config/logger");
const path_1 = __importDefault(require("path"));
exports.router = (0, express_1.Router)();
// API documentation
exports.router.get('/', (req, res, next) => {
    res.sendFile(path_1.default.join(__dirname, '../index.html'));
});
exports.router.get("/user", (req, res, next) => {
    // logger.info(`auth user ID ${req.user}`);
    try {
        res.status(200).json(req.session ? { ...req.user } : {});
    }
    catch (error) {
        logger_1.logger.error(`${error}`);
        next(error);
    }
});
// router.get("/user", (req: Request, res: Response) => {
//   if (req.user) {
//     logger.info("currentuser", req.user);
//     res.status(200).json({ ...req.user });
//   } else if (req.session) {
//     const user = {
//     }
//     req.user = user;
//     logger.info("currentuser", req.user);
//     res.status(200).json({ ...req.user });
//   } else {
//     res.status(200).json({});
//   }
// });
