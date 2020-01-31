const mongoose = require("mongoose");

const theory_schema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    course : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: "Id of Course is required"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Theory", theory_schema);
