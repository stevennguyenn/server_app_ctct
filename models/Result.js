const mongoose = require("mongoose")

const result_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Exercise"
    },
    type: {
        type: String,
        enum: ["exercise", "middle", "end"],
        required: true
    },
    point: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true,
    },
    result_questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "ResultQuestion"
        }
    ],
    diamond: {
        type: Number,
        required: true,
    }, 
    experience: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
        select: true
    },
    updated_at: {
        type: Date,
        default: Date.now,
        select: true
    },
    __v: {
        type: Number,
        select: false
    }
})
 
module.exports = mongoose.model("Result", result_schema)