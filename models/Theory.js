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
    }
}, {
    timestamps: true
})
 
module.exports = mongoose.model("Theory", theory_schema);
