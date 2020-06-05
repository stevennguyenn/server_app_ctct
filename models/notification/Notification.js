const mongoose = require("mongoose");

const notification_schema = mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    toAll: {
        type: Boolean,
    },
    type: {
        type: String,
        require: true,
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