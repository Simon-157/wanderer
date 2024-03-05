// googleAuth.ts

import "dotenv/config";
import passport from "passport";
import { Strategy as GoogleStrategy, StrategyOptions } from "passport-google-oauth20";
import { prisma } from "@/config/prisma";
import { randomUUID } from "crypto";


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
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            {
              authProviders: {
                some: {
                  providerId: profile.id,
                },
              },
            },
            { email: profile.emails![0].value },
          ],
        },
        include: { authProviders: true },
      });

      console.log(user);

      if (user) {
        done(null, user);
      } else {
        if (profile.photos && profile.emails) {
        const newUser = await prisma.user.create({
            data: {
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                profileImage: profile.photos[0].value,
                uniqueId: randomUUID(),
                authProviders: {
                    create: {
                        provider: 'google',
                        providerId: profile.id,
                    },
                },
                password: '',
            },
            include: { authProviders: true },
        });

          console.log(newUser);
          done(null, newUser);
        }
      }
    } catch (err) {
      console.error(err);
      done(err, null);
    }
  }
);

const serializeMiddleware = (user: any, done: any) => {
  try {
    console.log(user);
    done(null, user.id);
  } catch (err) {
    console.error(err);
    done(err, null);
  }
};

const deserializeMiddleware = async (userId: number, done: any) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: { authProviders: true },
    });

    if (user) {
      done(null, user);
    } else {
      done(null, null);
    }
  } catch (err) {
    console.error(err);
    done(err, null);
  }
};

passport.use(googleStrategyMiddleware);
passport.serializeUser(serializeMiddleware);
passport.deserializeUser(deserializeMiddleware);

export default passport;
