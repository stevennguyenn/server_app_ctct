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
    id_subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },
    students: {
        type: Number,
        default: 0,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
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
