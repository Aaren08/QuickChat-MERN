import express from "express";
import {
  sendMessage,
  getAllMessages,
  getAllUsers,
  markMessageAsSeen,
} from "../controllers/messageController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const messageRouter = express.Router();

messageRouter.route("/sendMessage").post(protectRoute, sendMessage);
messageRouter.route("/:id").get(protectRoute, getAllMessages);
messageRouter.route("/users").get(protectRoute, getAllUsers);
messageRouter.route("/mark/:id").put(protectRoute, markMessageAsSeen);

export default messageRouter;
