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
    theory: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Theory"
    }],
    type: {
        type: String,
        enum: ["exercise", "middle", "end"],
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
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User",
        select: false
    }],
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