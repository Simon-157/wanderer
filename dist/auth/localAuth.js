"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const prisma_1 = require("../config/prisma");
const functions_1 = require("../utils/functions");
const localStrategyMiddleware = new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, async (email, password, done) => {
    try {
        const user = await prisma_1.prisma.appUser.findFirst({
            where: { email: email },
        });
        if (!user) {
            return done(null, false, { message: "Incorrect email." });
        }
        if (!(0, functions_1.validatePassword)(user.password, password)) {
            return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
    }
    catch (err) {
        console.error(err);
        return done(err, null);
    }
});
const serializeMiddleware = (user, done) => {
    try {
        console.log(user);
        done(null, user.id);
    }
    catch (err) {
        console.error(err);
        done(err, null);
    }
};
const deserializeMiddleware = async (userId, done) => {
    try {
        const user = await prisma_1.prisma.appUser.findFirst({
            where: { id: userId },
        });
        if (user) {
            done(null, user);
        }
        else {
            done(null, null);
        }
    }
    catch (err) {
        console.error(err);
        done(err, null);
    }
};
passport_1.default.use(localStrategyMiddleware);
passport_1.default.serializeUser(serializeMiddleware);
passport_1.default.deserializeUser(deserializeMiddleware);
exports.default = passport_1.default;
// import passport from "passport";
// import { verifyMfaToken } from '@/services/mfa_service';
// import { Strategy as LocalStrategy } from "passport-local";
// import { prisma } from "@/config/prisma";
// import { validatePassword } from "@/utils/functions";
// import { NextFunction } from "express";
// import { logger } from "@/config/logger";
// import { log } from "console";
// interface CustomVerifyOptions extends passport.AuthenticateOptions {
//   mfaRequired?: boolean;
//   message: string;
// }
// const localStrategyMiddleware = new LocalStrategy(
//   {
//     usernameField: "email",
//     passwordField: "password",
//   },
//   async (email, password, done) => {
//     logger.info(`LocalStrategy: ${email} ${password}`);
//     try {
//       const user = await prisma.appUser.findFirst({
//         where: { email: email },
//       }) ;
//       if (!user) {
//         logger.info("Incorrect email.");
//         return done(null, false, { message: "Incorrect email." });
//       }
//       if (!validatePassword(user.password, password)) {
//         logger.info("Incorrect password.");
//         return done(null, false, { message: "Incorrect password." });
//       }
//       return done(null, user);
//     } catch (err) {
//       console.error(err);
//       return done(err, false);
//     }
//   }
// );
// const mfaVerificationMiddleware = async (req:any, res:any, next:NextFunction) => {
//   if (req.user && req.user.enabledMfa) {
//     // Check if MFA token is provided
//     const { mfaToken } = req.body;
//     if (!mfaToken) {
//       return res.status(400).json({ message: "MFA token is required." });
//     }
//     // Verify MFA token
//     try {
//       const isValid = await verifyMfaToken(req.user.id, mfaToken);
//       if (!isValid) {
//         return res.status(401).json({ message: "Invalid MFA token." });
//       }
//       req.user.mfaRequired = false; 
//       return next();
//     } catch (err) {
//       logger.log({ level: "error", message: `${err}` });
//       return res.status(500).json({ message: "Failed to verify MFA token." });
//     }
//   }
//   next();
// };
// const serializeMiddleware = (user:any, done:any) => {
//   try {
//     done(null, { id: user.id, mfaEnabled: user.mfaEnabled }); 
//   } catch (err) {
//     logger.log({ level: "error", message: `${err}` });
//     done(err, null);
//   }
// };
// const deserializeMiddleware = async ({ id, mfaEnabled }: { id: number, mfaEnabled: boolean }, done: Function) => {
//   try {
//     const user = await prisma.appUser.findFirst({
//       where: { id: id },
//     }) ;
//     if (user) {
//       user.mfaEnabled = mfaEnabled; 
//       done(null, user);
//     } else {
//       done(null, null);
//     }
//   } catch (err) {
//     logger.log({ level: "error", message: `${err}` });
//     done(err, null);
//   }
// };
// passport.use(localStrategyMiddleware);
// passport.serializeUser(serializeMiddleware);
// passport.deserializeUser(deserializeMiddleware);
// export { passport, mfaVerificationMiddleware };
