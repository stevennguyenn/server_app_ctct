const router = require("express").Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

router.post("/", async (req, res) => {
    const user = new User(req.body)
    await user.save()
    res.send({
        status  : true,
        message : null,
        data    : user
    })
})

router.post("/change_password", auth, async (req, res) => {
    const user = req.user
    const password = req.user.password
    const {old_password, new_password} = req.body
    const isPasswordMatch = await bcrypt.compare(old_password, password)
    if (isPasswordMatch == true) {
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

router.post("/change_avatar", auth, async (req, res) => {
    const user = req.user
    const {avatar} = req.body
    user.img_avatar = avatar
    user.updated_at = Date.now();
    await user.save()
    res.send({
        status  : true,
        message : null,
        data    : user
    })
})

router.post("/change_background", auth, async (req, res) => {
    const user = req.user
    const {background} = req.body
    user.img_background = background
    user.updated_at = Date.now();
    await user.save()
    res.send({
        status  : true,
        message : null,
        data    : user
    })
})

router.get("/:idUser", auth, async (req, res) => {
    const user = await User.findOne({_id: req.params.idUser})
    res.send({
        status  : true,
        message : null,
        data    : user
    })
})

router.post("/change_public_info", auth, async (req, res) => {
    const user = req.user
    const {learn_at, location_at, phone} = req.body
    user.learn_at = learn_at
    user.location_at = location_at
    user.phone = phone
    user.updated_at = Date.now();
    await user.save()
    res.send({
        status  : true,
        message : null,
        data    : user
    })
})

router.post("/login", async (req, res) => {
    const {email, password, device_type, fcm_token} = req.body
    console.log(email);
    console.log(password);
    // Search for a user by email and password.
    const user = await (User.findOne({ email}))
    if (!user) {
        throw new Error("Invalid login credentials")
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error("Invalid login credentials")
    }
    const token = await user.generateAuthToken()
    user.device_type = device_type
    user.token = token
    user.fcm_token = fcm_token
    await user.save()
    res.status(201).send({
        status  : true,
        message : null,
        data    : user
    })
})

router.post("/update_fcm_token", auth, async (req, res) => {
    const {fcm_token} = req.body;
    user.fcm_token = fcm_token;
    await user.save()
    res.status(201).send({
        status  : true,
        message : "Success",
    })
})

router.post("/logout", auth, async (req, res) => {
    const user = req.user;
    req.user.fcm_token = "";
    user.token = "";
    await user.save()
    res.status(201).send({
        status  : true,
        message : "Success",
    })
})

router.post("/admin_login", async(req, res) => {
    const {email, password, fcm_token} = req.body
    const user = await (User.findOne({email}))
    if (!user)  {
        throw new Error("Invalid login credentials")
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error("Invalid login credentials")
    }
    if (!user.is_admin) {
        throw new Error("Invalid login credentials")
    }
    const token = await user.generateAuthToken()
    user.fcm_token = fcm_token
    await (user.save())
    res.status(201).send({
        status: true,
        message: null,
        data: user
    })
})

router.post("/admin", admin, async (req, res) => {
    const super_admin = req.user
    if (!super_admin.is_super_admin)   {
        throw new Error("Invalid authority")
    }
    const {email} = req.body
    const new_admin = await User.findOne({email})
    if (!new_admin)  {
        throw new Error("Invalid email")
    }
    if (new_admin.is_admin) {
        throw new Error("Already an admin")
    }
    new_admin.is_admin = true
    res.status(201).send({
        status: true,
        message: "Success"
    })
})

router.get("/", admin, async (req, res) => {
    const offset = Number(req.query.offset)
    const num = Number(req.query.number)
    const users = await User.find().populate().skip(offset).limit(num)
    res.send({
        status  : true,
        message : null,
        data    : users
    })
})

router.post("/length", async (req, res) => {    // NOTE: POST works while GET doesn't and I don't understand why??????
    console.log("something")
    await User.countDocuments({}, (err, result) => {
        if (err)    {
            console.log(err)
            res.send(500)
        }
        res.send({
            status: true,
            message: null,
            data: result
        })
    })
})


module.exports = router;