const mongoose = require("mongoose");

const notification_schema = mongoose.Schema({
    id_course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    type: {
        type: String,
        enum: ["theory", "exercise", "video", "reference_document", "comment"],
        required: true,
    },
    id_data: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }, 
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Notification", notification_schema);