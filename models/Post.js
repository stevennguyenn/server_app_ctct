const mongoose = require("mongoose");

const post_schema = mongoose.Schema({
    device_id: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    }, 
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            required: "Comments is required",
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model("Post", post_schema);
