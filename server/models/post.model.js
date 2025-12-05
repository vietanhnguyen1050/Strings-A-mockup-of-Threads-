import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, default: "" },
    media: [{ type: String }], // cloudinary urls
    datePosted: { type: Date, default: Date.now },
    reacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // users who reacted
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // comment post ids
    repostedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replyingTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    }, // if this is a comment
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
