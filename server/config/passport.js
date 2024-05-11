import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import getPrismaInstance from "../utils/PrismaClient.js";

const prisma = getPrismaInstance();

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }

      if (!bcrypt.compareSync(password, user.hashedPassword)) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
