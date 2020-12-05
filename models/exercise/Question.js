const mongoose = require("mongoose")

const question_schema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    options: [
        {
            _id: {
                type: Number,
                required: true
            },
            content: {
                type: String,
                required: true
            },
            is_correct: {
                type: Boolean,
                required: true
            },
        }
    ],
    type: {
        type: String,
        enum: ["choice", "fill"],
        required: true
    },
    answer: {
        type: String,
        required: false,
        // select: false
    },
    theory: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Theory"
    },
    level: {
        type: String,
        enum : ["easy", "medium", "hard"],
        required: true
    },
    explanation: {
        type: String,
        required: false,
    }, 
    created_at: {
        type: Date,
        default: Date.now
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
}, { versionKey: false })
 
module.exports = mongoose.model("Question", question_schema)