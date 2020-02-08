const mongoose = require("mongoose")

const option_schema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    is_correct: {
        type: Boolean,
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Question"
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
 
module.exports = mongoose.model("Option", option_schema)
