const mongoose = require("mongoose")

const video_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        enum: ["youtube", "mp4"],
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
    video_course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },
    url: {
        type: String,
        required: true,
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
 
module.exports = mongoose.model("Video", video_schema)