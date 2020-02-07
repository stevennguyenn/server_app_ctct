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