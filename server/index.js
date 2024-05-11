import dotenv, { config } from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import AuthRoutes from "./routes/AuthRoutes.js";
import ActionRoutes from "./routes/ActionRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import e from "./utils/ErrorHandler.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"], // Allow domain
    credentials: true, // Allows transfering cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
    }),
    secret: process.env.SESSION_CODE,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", AuthRoutes);
app.use("/api/action", ActionRoutes);
app.use("/api/message", MessageRoutes);

app.use(e);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server has started on port `, process.env.PORT);
});
