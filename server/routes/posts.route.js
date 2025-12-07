import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  toggleLike,
  toggleRepost
} from "../controllers/post.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { uploadMedia } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:postId", getPostById);

router.post("/", requireAuth, uploadMedia.array("media", 10), createPost);
router.post("/:postId/like", requireAuth, toggleLike);
router.post("/:postId/repost", requireAuth, toggleRepost);

export default router;

