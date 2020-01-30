const router = require("express").Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")

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