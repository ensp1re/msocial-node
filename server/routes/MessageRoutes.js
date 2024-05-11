import express from "express";
import {
  RelationMessage,
  getAllRelation,
  getRelation,
  sendMessage,
} from "../controllers/MessageController.js";

const router = express.Router();

router.post("/create-relation", RelationMessage);
router.post("/send-message", sendMessage);

router.get("/get-relation", getRelation);
router.get("/get-all-relations", getAllRelation);

export default router;
