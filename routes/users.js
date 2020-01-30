const router = require("express").Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const auth = require("../middleware/auth")

router.post("/", async (req, res) => {
    const user = new User(req.body)
    await user.save()
    res.send({
        status  : true,
        message : null,
        data    : {
            user
        }
    })
})

router.post("/change_password", auth, async (req, res) => {
    const user = req.user
    const password = req.user.password
    const {old_password, new_password} = req.body
    const isPasswordMatch = await bcrypt.compare(old_password, password)
    if (isPasswordMatch == true) {
        user.tokens = []
        user.token = ""
        console.log(new_password)
        user.password = new_password
        await user.save();
        res.send({
            status  : true,
            message : "Change password successed",
        })
    } else {
        res.send({
            status  : false,
            message : "Password incorrect",
        })
    }
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body
    // Search for a user by email and password.
    const user = await User.findOne({ email} )
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const token = await user.generateAuthToken()
    user.token = token
    res.status(201).send({
        status  : true,
        message : null,
        data    : user
    })
})

module.exports = router;