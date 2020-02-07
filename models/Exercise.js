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
        required: true,
    },
    expire_at: {
        type: Date,
        default: Date.now
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})
 
module.exports = mongoose.model("Exercise", exercise_schema)