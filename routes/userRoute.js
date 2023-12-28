import express from "express";
import {
  authMiddleware,
  deletePostController,
  getAllPostController,
  getPostByUser,
  updatePostController,
  updateUserController,
  userPostController,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.put("/update", authMiddleware, updateUserController);
userRouter.post("/create-post", authMiddleware, userPostController);
userRouter.get("/get-all-posts", getAllPostController);
userRouter.get("/get-user-post", authMiddleware, getPostByUser);
userRouter.delete("/delete-post/:id", authMiddleware, deletePostController);
userRouter.put("/update-post/:id", authMiddleware, updatePostController);

export default userRouter;
