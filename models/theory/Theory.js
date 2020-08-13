const mongoose = require("mongoose");

const theory_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    course : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },
    content : {
        type: String,
        required: true
    },
    like : {
        type: Boolean,
        select: false
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
 
module.exports = mongoose.model("Theory", theory_schema);
