import express from "express";
import {
  Comment,
  Notification,
  checkFollowing,
  checkUser,
  deleteById,
  findUserByKeyText,
  findUserByUsername,
  follow,
  getAllNotificationsById,
  getAllThePosts,
  getAllThePostsByUsername,
  getPostById,
  like,
  post,
  repost,
  savePost,
  unfollow,
} from "../controllers/ActionController.js";

const router = express.Router();

router.post("/post", post);
router.post("/repost", repost);
router.post("/comment", Comment);
router.post("/save", savePost);
router.post("/like", like);
router.post("/follow", follow);
router.post("/unfollow", unfollow);
router.get("/get-posts", getAllThePosts);
router.get("/get-post-by-id", getPostById);
router.get("/get-posts-by-username", getAllThePostsByUsername);
router.get("/get-users-by-keyword", findUserByKeyText);
router.get("/check-user", checkUser);
router.get("/get-user-by-username", findUserByUsername);
router.post("/get-all-notifications", getAllNotificationsById);
router.post("/delete", deleteById);

router.post("/check-following", checkFollowing);
router.post("/create-notification", Notification);

export default router;
