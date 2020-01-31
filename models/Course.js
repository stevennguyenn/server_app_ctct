const mongoose = require("mongoose");

const course_schema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }, 
}, {
    timestamps: true
})

module.exports = mongoose.model("Course", course_schema);
