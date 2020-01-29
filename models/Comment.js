const mongoose = require("mongoose");

const comment_schema = mongoose.Schema({
    content: {
        type: String,
        required: "Content is required"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        require: "Post is required"
    }
}, {
    timestamps: true
}
);

module.exports = mongoose.model("Comment", comment_schema);