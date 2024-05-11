import express from "express";
import {
  changeUserInfo,
  isAuthenticated,
  login,
  logout,
  register,
} from "../controllers/AuthController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

router.post("/update-user", changeUserInfo);

router.get("/logout", logout);
router.get("/is-auth", isAuthenticated);

export default router;
