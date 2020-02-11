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
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Exercise"
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
 
module.exports = mongoose.model("Result", result_schema)