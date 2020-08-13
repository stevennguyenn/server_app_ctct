const mongoose = require("mongoose")

const image_schema = mongoose.Schema({
    data: {
        type: String
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
 
module.exports = mongoose.model("Image", image_schema)