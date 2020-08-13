const mongoose = require("mongoose");

const comment_schema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: "Content is required"
    },
    theory: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    is_parent: {
        type: Boolean,
        required: true,
        default: true
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
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

module.exports = mongoose.model("Comment", comment_schema);