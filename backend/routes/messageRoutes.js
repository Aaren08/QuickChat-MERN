import express from "express";
import {
  sendMessage,
  getAllMessages,
  getAllUsers,
  markMessageAsSeen,
} from "../controllers/messageController.js";
import { protectRoute } from "../middleware/auth.js";

const messageRouter = express.Router();

messageRouter.route("/users").get(protectRoute, getAllUsers);
messageRouter.route("/mark/:id").put(protectRoute, markMessageAsSeen);
messageRouter.route("/:id").post(protectRoute, sendMessage);
messageRouter.route("/:id").get(protectRoute, getAllMessages);

export default messageRouter;
