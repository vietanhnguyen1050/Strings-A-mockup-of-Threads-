import express from "express";
import { getProfile, updateMe, uploadAvatar } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { uploadMedia } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/:userId/profile", getProfile);
router.patch("/me", requireAuth, updateMe);
router.post("/me/avatar", requireAuth, uploadMedia.single("avatar"), uploadAvatar);

export default router;
