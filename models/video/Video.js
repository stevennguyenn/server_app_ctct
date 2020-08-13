const mongoose = require("mongoose")

const video_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img_background: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },
    theory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Theory"
        }
    ],
    url: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user_seen: {
        type: Number,
        required: true,
        default: 0
    },
    is_like: {
        type: Boolean,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    __v: {
        type: Number,
        select: false
    }
})
 
module.exports = mongoose.model("Video", video_schema)