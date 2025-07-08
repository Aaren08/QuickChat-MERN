import express from "express";
import {
  signUpUser,
  logInUser,
  updateUserProfile,
  isUserAuthenticated,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.route("/signUp").post(signUpUser);
userRouter.route("/logIn").post(logInUser);
userRouter.route("/updateProfile").put(protectRoute, updateUserProfile);
userRouter.route("/check").get(protectRoute, isUserAuthenticated);

export default userRouter;
