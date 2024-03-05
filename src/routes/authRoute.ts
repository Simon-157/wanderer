import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import createHttpError from "http-errors";
import { logger } from "../config/logger";
import { prisma } from "@/config/prisma";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { validateUser } from "@/utils/functions";
import "../auth/googleAuth";
import "../auth/localAuth";
import "dotenv/config";

export const router = Router();

router.get("/google", passport.authenticate("google"));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect:
            process.env.NODE_ENV == "production"
                ? process.env.CLIENT_URI_CALLBACK_PROD
                : process.env.CLIENT_URI_CALLBACK,
        failureRedirect: "/auth/failure",
    })
);

router.post(
    "/local",
    passport.authenticate("local", {
        failWithError: true,
        failureRedirect: "/auth/failure",
    }),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).json(req.user);
        } catch (error) {
            logger.error(`${error}`);
            next(
                createHttpError(
                    400,
                    "Something Went Wrong. Probably invalid credentials"
                )
            );
        }
    }
);

router.get("/user", (req: Request, res: Response) => {
    res.status(200).json(req.user ? { ...req.user } : {});
});

router.get("/failure", (req: Request, res: Response) => {
    res.status(401).json({ message: "Login failed" });
});



router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
    try {
        req.logOut(() =>
            req.session.destroy((error: any) => {
                if (error) {
                    throw createHttpError(400, "Bad/Invalid logout request");
                }
            })
        );

        res.status(200).json({
            isAuth: req.isAuthenticated(),
            message: req.isAuthenticated()
                ? "Currently authenicated"
                : " Currently unauthenticated",
        });
    } catch (error) {
        next(error);
    }
});



router.post("/register", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }
    const { email, password, firstName, lastName } = req.body;

    try {
        const existingUser = await prisma.user.findFirst({ where: { email } });

        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                uniqueId: randomUUID(),
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
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Error creating user" });
    }
});
