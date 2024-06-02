"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const prisma_1 = require("../config/prisma");
const crypto_1 = require("crypto");
const logger_1 = require("../config/logger");
const googleStrategyMiddleware = new passport_google_oauth20_1.Strategy({
    clientID: process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_CLIENT_ID_PROD
        : process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_CLIENT_SECRET_PROD
        : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_CALLBACK_URL_PROD
        : process.env.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await prisma_1.prisma.appUser.findFirst({
            where: {
                OR: [
                    {
                        AuthProvider: {
                            some: {
                                googleId: profile.id,
                            },
                        },
                    },
                    { email: profile.emails[0].value },
                ],
            },
            include: { AuthProvider: true },
        });
        // console.log(user);
        if (user) {
            done(null, user);
        }
        else {
            if (profile.photos && profile.emails) {
                const newUser = await prisma_1.prisma.appUser.create({
                    data: {
                        email: profile.emails[0].value,
                        password: (0, crypto_1.randomUUID)(),
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        profileImage: profile.photos[0].value,
                        phoneNumber: null,
                        bio: null,
                        linkedIn: null,
                        mfaEnabled: false, // Disable MFA by default
                        AuthProvider: {
                            create: {
                                googleId: profile.id,
                            },
                        },
                    },
                    include: { AuthProvider: true },
                });
                console.log(newUser);
                done(null, newUser);
            }
        }
    }
    catch (err) {
        console.error(err);
        done(err, null);
    }
});
const serializeMiddleware = (user, done) => {
    try {
        // console.log(user);
        done(null, user.id);
    }
    catch (err) {
        console.error(err);
        done(err, null);
    }
};
const deserializeMiddleware = async (id, done) => {
    console.log(id);
    try {
        logger_1.logger.info(`auth user ID ${id}`);
        const user = await prisma_1.prisma.appUser.findFirst({
            where: { id: id },
            include: { AuthProvider: true },
        });
        logger_1.logger.log({ level: "info", message: `${user}` });
        done(null, user);
    }
    catch (err) {
        logger_1.logger.log({ level: "error", message: `${err}` });
        done(err, null);
    }
};
passport_1.default.use(googleStrategyMiddleware);
passport_1.default.serializeUser(serializeMiddleware);
passport_1.default.deserializeUser(deserializeMiddleware);
exports.default = passport_1.default;
