const mongoose = require("mongoose")

const course_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    list_video: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Video"
        }
    ],
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
 
module.exports = mongoose.model("Course", course_schema)
