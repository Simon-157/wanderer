import "dotenv/config";
import passport from "passport";
import { Strategy as GoogleStrategy, StrategyOptions } from "passport-google-oauth20";
import { prisma } from "../config/prisma";
import { randomUUID } from "crypto";
import { logger } from "../config/logger";


const googleStrategyMiddleware = new GoogleStrategy(
  {
    clientID:
      process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_CLIENT_ID_PROD
        : process.env.GOOGLE_CLIENT_ID,
    clientSecret:
      process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_CLIENT_SECRET_PROD
        : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:
      process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_CALLBACK_URL_PROD
        : process.env.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
  } as StrategyOptions,
  async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) => {
    try {
      const user = await prisma.appUser.findFirst({
        where: {
          OR: [
            {
              AuthProvider: {
                some: {
                  googleId: profile.id,
                },
              },
            },
            { email: profile.emails![0].value },
          ],
        },
        include: { AuthProvider: true },
      });

      // console.log(user);

      if (user) {
        done(null, user);
      } else {
        if (profile.photos && profile.emails) {
          const newUser = await prisma.appUser.create({
            data: {
              email: profile.emails[0].value,
              password: randomUUID(),
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

          logger.log('info', newUser);
          done(null, newUser);
        }
      }
    } catch (err) {
      logger.log({ level: "error", message: `${err}` });
      done(err, null);
    }
  }
);

const serializeMiddleware = (user: Partial<any>, done: any) => {
  try {
    // console.log(user);
    done(null, user.id);
  } catch (err) {
    logger.log({ level: "error", message: `${err}` });
    done(err, null);
  }
};

const deserializeMiddleware = async (userId: any, done: any) => {
  console.log(userId);
  try {
    logger.info(`auth user ID ${userId}`);
    const user = await prisma.appUser.findFirst({
      where: { id: parseInt(userId) },
      include: { AuthProvider: true },
    });

    logger.log({ level: "info", message: `${user}` });


    done(null, user);
 
  } catch (err) {
    logger.log({ level: "error", message: `${err}` });
    done(err, null);
  }
};

passport.use(googleStrategyMiddleware);
passport.serializeUser(serializeMiddleware);
passport.deserializeUser(deserializeMiddleware);
