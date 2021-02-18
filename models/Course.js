const mongoose = require("mongoose")

var SchemaTypes = mongoose.Schema.Types;
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
    number_theory: {
        type: Number,
        default: 0,
    },
    number_exercise: {
        type: Number,
        default: 0,
    },
    number_video: {
        type: Number,
        default: 0,
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    intro: {
        type: String,
        required: true
    },
    struct: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    goal: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    rate: {
        type: String,
        required: true,
    },
    like: {
        type: Number,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
})
 
module.exports = mongoose.model("Course", course_schema)
