import passport from "../config/passport.js";
import bcrypt from "bcryptjs";
import getPrismaInstance from "../utils/PrismaClient.js";

const prisma = getPrismaInstance();

export const register = async (req, res) => {
  try {
    const { email, password, username, nickname, avatar } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingEmail) {
      return res.status(500).json({
        message: "This email has already registered!",
      });
    }

    if (existingUsername) {
      return res.status(500).json({
        message: "This username has already taken!",
      });
    }
    const user = await prisma.user.create({
      data: {
        email: email,
        hashedPassword: hashedPassword,
        username: username,
        avatarUrl: avatar ? avatar : null,
        nickname: nickname ? nickname : null,
      },
    });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: err.toString() });
      return res.status(201).json({
        data: user,
      });
    });
  } catch (error) {
    res.status(401).json({ error: error.message || "Something went wrong" });
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        message: `Incorrect email or password. ${info}`,
      });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json({ message: "Login is successful", data: user });
    });
  })(req, res, next);
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error during logout" });
    }
    req.session.destroy(() => {
      res.json({
        message: "Logout successful.",
      });
    });
  });
};

export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.status(200).json({ message: true });
  }
  res.status(200).json({ message: false });
}

export const changeUserInfo = async (req, res) => {
  try {
    const { userId, username, nickname, avatar, bio } = req.body;

    if (!userId)
      return res.status(500).json({
        message: "UserId is required!",
      });

    const userData = {};

    if (username) userData.username = username;
    if (nickname) userData.nickname = nickname;
    if (avatar) userData.avatarUrl = avatar;
    if (bio) userData.bio = bio;

    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      return res.status(500).json({
        message: "This username has already been taken!",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: userData,
    });

    if (!user) {
      return res.status(401).json({
        error: "Something went wrong",
      });
    }

    return res.status(201).json({
      message: "Successfully",
      data: user,
    });
  } catch (error) {
    res.status(401).json({ error: error.message || "Something went wrong" });
  }
};
