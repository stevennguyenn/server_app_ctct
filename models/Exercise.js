const mongoose = require("mongoose")

const exercise_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },
    type: {
        type: String,
        enum: ["exercise", "competition"],
        required: true
    },
    level: {
        type: String,
        enum : ["easy", "medium", "hard"],
        required: true
    },
    theme: {
        type: String,
        required: false,
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Question"
        }
    ],
    time: {
        type: Number,
        required: true
    },
    expire_at: {
        type: Date,
        default: Date.now,
        select: false
    },
    created_at: {
        type: Date,
        default: Date.now,
        select: false
    },
    updated_at: {
        type: Date,
        default: Date.now,
        select: false
    },
    __v: {
        type: Number,
        select: false
    }
})
 
module.exports = mongoose.model("Exercise", exercise_schema)