const mongoose = require("mongoose")

const subject_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    students: {
        type: Number,
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
 
module.exports = mongoose.model("Subject", subject_schema)
