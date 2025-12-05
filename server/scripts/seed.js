import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import bcrypt from "bcrypt";

const MONGO = process.env.MONGO_URL;
if (!MONGO) {
  console.error("Set MONGO_URL in .env");
  process.exit(1);
}

await mongoose.connect(MONGO);

try {
  console.log("Clearing data...");
  await Promise.all([User.deleteMany({}), Post.deleteMany({})]);

  console.log("Creating users...");
  const p1 = await bcrypt.hash("password123", 12);
  const p2 = await bcrypt.hash("password123", 12);

  const u1 = await User.create({
    username: "alice",
    displayName: "Alice Nguyen",
    dob: new Date("1990-01-01"),
    phoneNumber: "0123456789",
    email: "alice@example.com",
    passwordHash: p1,
    avatar: "",
    bio: "Hello I'm Alice"
  });

  const u2 = await User.create({
    username: "bob",
    displayName: "Bob Tran",
    dob: new Date("1988-05-05"),
    phoneNumber: "0987654321",
    email: "bob@example.com",
    passwordHash: p2,
    avatar: "",
    bio: "Hi I'm Bob"
  });

  console.log("Creating posts...");
  const post1 = await Post.create({
    userId: u1._id,
    content: "My first post on Strings!",
    media: [],
  });

  const post2 = await Post.create({
    userId: u2._id,
    content: "Replying to Alice",
    media: [],
    replyingTo: post1._id
  });

  // link comments and user lists
  await Post.findByIdAndUpdate(post1._id, { $push: { comments: post2._id }});
  await User.findByIdAndUpdate(u1._id, { $push: { posts: post1._id }});
  await User.findByIdAndUpdate(u2._id, { $push: { comments: post2._id }});

  console.log("Seed done.");
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
