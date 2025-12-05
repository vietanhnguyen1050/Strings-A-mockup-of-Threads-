import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import fs from "fs/promises";
import { uploadToCloudinary } from "../utils/cloudinary.js";

/**
 * GET /users/:userId/profile
 * returns user info + posts + comments + liked + reposted + followers + following
 */
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-passwordHash").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const [posts, comments, liked, reposted, followers, following] = await Promise.all([
      Post.find({ userId: userId }).sort({ datePosted: -1 }).populate("userId", "username displayName avatar").lean(),
      Post.find({ _id: { $in: user.comments } }).sort({ datePosted: -1 }).populate("userId", "username displayName avatar").lean(),
      Post.find({ _id: { $in: user.likedPosts } }).sort({ datePosted: -1 }).populate("userId", "username displayName avatar").lean(),
      Post.find({ _id: { $in: user.repostedPosts } }).sort({ datePosted: -1 }).populate("userId", "username displayName avatar").lean(),
      User.find({ _id: { $in: user.followers } }).select("username displayName avatar").lean(),
      User.find({ _id: { $in: user.following } }).select("username displayName avatar").lean()
    ]);

    res.json({ user, posts, comments, liked, reposted, followers, following });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * PATCH /users/me
 * allowed: displayName, bio, avatar
 * dob is not editable
 */
export const updateMe = async (req, res) => {
  try {
    const userId = req.userId;
    const { displayName, bio, avatar } = req.body;

    const update = {};
    if (displayName) update.displayName = displayName;
    if (bio !== undefined) update.bio = bio;
    if (avatar) update.avatar = avatar;

    const updated = await User.findByIdAndUpdate(userId, update, { new: true }).select("-passwordHash");
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /users/me/avatar
 * single file form-data 'avatar'
 * Accepts multer middleware and uploads to cloudinary.
 */
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file" });

    const url = await uploadToCloudinary(file.path);
    await fs.unlink(file.path).catch(()=>{});
    const updated = await User.findByIdAndUpdate(userId, { avatar: url }, { new: true }).select("-passwordHash");
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
