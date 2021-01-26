const mongoose = require("mongoose");

const reference_course_schema = mongoose.Schema({
    id_course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
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
 
module.exports = mongoose.model("ReferenceCourse", reference_course_schema);