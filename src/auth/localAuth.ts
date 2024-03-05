import "dotenv/config";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "@/config/prisma";
import { validatePassword } from "@/utils/functions";


const localStrategyMiddleware = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email: string, password: string, done: any) => {
    try {
      const user = await prisma.user.findFirst({
        where: { email: email },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }
      
      if (!validatePassword(user.password, password)) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      console.error(err);
      return done(err, null);
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

passport.use(localStrategyMiddleware);
passport.serializeUser(serializeMiddleware);
passport.deserializeUser(deserializeMiddleware);

export default passport;
