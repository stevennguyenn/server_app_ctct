const mongoose = require("mongoose")

const theme_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },
    __v: {
        type: Number,
        select: false
    }
})
 
module.exports = mongoose.model("Theme", theme_schema)