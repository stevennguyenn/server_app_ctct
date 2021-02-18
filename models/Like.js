const mongoose = require("mongoose");

const like_schema = mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    id_content: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        enum: ["theory", "exercise", "video", "course"],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})
 
module.exports = mongoose.model("Like", like_schema);
