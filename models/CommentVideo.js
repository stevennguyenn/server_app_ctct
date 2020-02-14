const mongoose = require("mongoose");

const comment_video_schema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: "Content is required"
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    is_parent: {
        type: Boolean,
        required: true,
        default: true
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CommentVideo'
        }
    ],
    created_at: { 
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("CommentVideo", comment_video_schema);