"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const http_errors_1 = __importDefault(require("http-errors"));
const logger_1 = require("../config/logger");
const prisma_1 = require("../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const functions_1 = require("../utils/functions");
require("../auth/googleAuth");
require("../auth/localAuth");
require("dotenv/config");
exports.router = (0, express_1.Router)();
exports.router.get("/google", passport_1.default.authenticate("google"));
exports.router.get("/google/callback", passport_1.default.authenticate("google", {
    successRedirect: process.env.NODE_ENV == "production"
        ? process.env.CLIENT_URI_CALLBACK_PROD
        : process.env.CLIENT_URI_CALLBACK,
    failureRedirect: "/auth/failure",
}));
exports.router.post("/local", passport_1.default.authenticate("local", {
    failureRedirect: "/auth/failure",
    session: true,
    successRedirect: process.env.NODE_ENV == "production"
        ? process.env.CLIENT_URI_CALLBACK_PROD
        : process.env.CLIENT_URI_CALLBACK,
}), (req, res, next) => {
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        logger_1.logger.error(`${error}`);
        next((0, http_errors_1.default)(400, "Something Went Wrong. Probably invalid credentials"));
    }
});
exports.router.get("/failure", (req, res) => {
    res.status(401).json({ message: "Login failed" });
});
exports.router.get("/logout", (req, res, next) => {
    try {
        req.logOut(() => req.session.destroy((error) => {
            if (error) {
                throw (0, http_errors_1.default)(400, "Bad/Invalid logout request");
            }
        }));
        res.status(200).json({
            isAuth: req.isAuthenticated(),
            message: req.isAuthenticated()
                ? "Currently authenicated"
                : " Currently unauthenticated",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.router.post("/register", async (req, res) => {
    const { error } = (0, functions_1.validateUser)(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }
    const { email, password, firstName, lastName } = req.body;
    try {
        const existingUser = await prisma_1.prisma.appUser.findFirst({ where: { email } });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.prisma.appUser.create({
            data: {
                email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
            },
        });
        req.login(user, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: "Error logging in" });
            }
            return res.status(201).send({ message: "User created and logged in" });
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Error creating user" });
    }
});
