const mongoose = require("mongoose")

const course_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }, 
    videos: {
        type: mongoose.Schema.Types.ObjectId,
        select: false
    }
})
 
module.exports = mongoose.model("Course", course_schema)
