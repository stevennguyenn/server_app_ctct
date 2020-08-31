const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const user_schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    image_url: {
        type: String
    },
    img_avatar: {
        type: String,
        required: false
    },
    img_background: {
        type: String,
        required: false
    },
    teacher: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    phone: {
        type: String,
        unique: true,
        validate: value => {
            if (!validator.isMobilePhone(value, 'vi-VN')) {
                throw new Error({error: 'Invalid Phone number'})
            }
        }
    },
    learn_at: {
        type: String,
    },
    location_at: {
        type: String,
    },
    number_video: {
        type: String,
    },
    number_exercise: {
        type: String,
    },
    rank: {
        type: Number
    },
    token: {
        type: String,
    },
    fcm_token: {
        type: String,
    },
    device_type: {
        type: String,
        enum : ["android", "iOS"]
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    is_admin:   {
        type: Boolean,
        default: false,
    },
    is_super_admin: {
        type: Boolean,
        default: false,
    }
})

user_schema.methods.toJSON = function() {
    var objc = this.toObject()
    delete objc.password
    return objc
}

user_schema.pre('save', async function(next){
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
})

user_schema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.token = token
    await user.save()
    return  token
}

module.exports = mongoose.model("User", user_schema);