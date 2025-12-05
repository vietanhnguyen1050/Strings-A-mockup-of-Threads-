import fs from "fs/promises";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

/**
 * Create a post (or create a comment if replyingTo provided)
 * Accepts multipart/form-data with up to 10 files in field 'media'
 * body: content (string), replyingTo (optional)
 */
export const createPost = async (req, res) => {
  try {
    const userId = req.userId;
    const { content, replyingTo } = req.body;
    const files = req.files || [];

    if (files.length > 10) {
      // cleanup
      for (const f of files) await fs.unlink(f.path).catch(()=>{});
      return res.status(400).json({ message: "Max 10 images allowed" });
    }

    // upload images to cloudinary
    const mediaUrls = [];
    for (const file of files) {
      try {
        const url = await uploadToCloudinary(file.path);
        mediaUrls.push(url);
      } catch (err) {
        console.error("Cloud upload error:", err);
      } finally {
        await fs.unlink(file.path).catch(()=>{});
      }
    }

    // create post
    const post = await Post.create({
      userId,
      content: content || "",
      media: mediaUrls,
      replyingTo: replyingTo || null
    });

    // update user lists and parent post if reply
    if (!replyingTo) {
      await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });
    } else {
      await User.findByIdAndUpdate(userId, { $push: { comments: post._id } });
      await Post.findByIdAndUpdate(replyingTo, { $push: { comments: post._id } });
    }

    // populate for response (author)
    const populated = await Post.findById(post._id)
      .populate("userId", "username displayName avatar")
      .populate({ path: "comments", options: { sort: { datePosted: -1 } }, populate: { path: "userId", select: "username displayName avatar" } })
      .lean();

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /posts?page=1&limit=20
 * returns paginated posts in reverse chronological order (top-level feed)
 */
export const getPosts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const limit = Math.min(50, parseInt(req.query.limit || "20"));
    const skip = (page - 1) * limit;

    // fetch posts where replyingTo == null (top-level), newest first
    const [total, posts] = await Promise.all([
      Post.countDocuments({}),
      Post.find({}) // include both top-level and comments if you want; here we return all posts; client can filter
        .sort({ datePosted: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "username displayName avatar")
        .populate({
          path: "comments",
          options: { sort: { datePosted: -1 } },
          populate: { path: "userId", select: "username displayName avatar" }
        })
        .lean()
    ]);

    res.json({
      data: posts,
      meta: { total, page, limit }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /posts/:postId
 */
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate("userId", "username displayName avatar")
      .populate({
        path: "comments",
        options: { sort: { datePosted: -1 } },
        populate: { path: "userId", select: "username displayName avatar" }
      })
      .lean();

    if (!post) return res.status(404).json({ message: "Not found" });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Toggle Like
 * POST /posts/:postId/like
 */
export const toggleLike = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Not found" });

    const already = post.reacts.find((id) => id.equals(userId));
    if (already) {
      post.reacts.pull(userId);
      await post.save();
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
      return res.json({ liked: false });
    } else {
      post.reacts.push(userId);
      await post.save();
      await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
      return res.json({ liked: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Toggle Repost
 * POST /posts/:postId/repost
 */
export const toggleRepost = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Not found" });

    const already = post.repostedBy.find((id) => id.equals(userId));
    if (already) {
      post.repostedBy.pull(userId);
      await post.save();
      await User.findByIdAndUpdate(userId, { $pull: { repostedPosts: postId } });
      return res.json({ reposted: false });
    } else {
      post.repostedBy.push(userId);
      await post.save();
      await User.findByIdAndUpdate(userId, { $push: { repostedPosts: postId } });
      return res.json({ reposted: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
