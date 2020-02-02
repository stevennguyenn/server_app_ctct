const mongoose = require("mongoose");

const comment_theory_schema = mongoose.Schema({
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
            ref: 'CommentTheory'
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

module.exports = mongoose.model("CommentTheory", comment_theory_schema);