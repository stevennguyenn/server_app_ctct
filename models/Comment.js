const mongoose = require("mongoose");

const comment_schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: "Content is required",
  },
  id_content: {
    type: String,
    required: true,
  },
  type: {
    type: ["theory", "exercise", "video"],
    required: true,
  },
  is_parent: {
    type: Boolean,
    required: true,
    default: true,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", comment_schema);
