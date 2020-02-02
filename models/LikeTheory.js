const mongoose = require("mongoose");

const like_theory_schema = mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    id_theory: {
        type: mongoose.Schema.Types.ObjectId,
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
 
module.exports = mongoose.model("LikeTheory", like_theory_schema);
