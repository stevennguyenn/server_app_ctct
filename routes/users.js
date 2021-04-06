const router = require("express").Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const https = require('https');
const configAuth = require("../config/config");
const StringDecoder = require('string_decoder').StringDecoder;
const d = new StringDecoder('utf8');

router.post("/", async (req, res) => {
    const user = new User(req.body)
    await user.save()
    res.send({
        status  : true,
        message : null,
        data    : user
    })
})

router.put("/change_password", auth, async (req, res) => {
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

router.put("/change_avatar", auth, async (req, res) => {
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

router.get("/:idUser", auth, async (req, res) => {
    const user = await User.findOne({_id: req.params.idUser})
    res.send({
        status  : true,
        message : null,
        data    : user
    })
})

router.put("/change_public_info", auth, async (req, res) => {
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

router.put("/login", async (req, res) => {
    const {email, password, fcm_token} = req.body
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
    user.token = token
    user.fcm_token = fcm_token
    await user.save()
    res.status(201).send({
        status  : true,
        message : null,
        data    : user
    })
})

router.put("/update_fcm_token", auth, async (req, res) => {
    const {fcm_token} = req.body;
    user.fcm_token = fcm_token;
    await user.save()
    res.status(201).send({
        status  : true,
        message : "Success",
    })
})

router.delete("/logout", auth, async (req, res) => {
    const user = req.user;
    req.user.fcm_token = "";
    user.token = "";
    await user.save()
    res.status(201).send({
        status  : true,
        message : "Success",
    })
})

router.put("/admin_login", async(req, res) => {
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

router.get("/", async (req, res) => {
    const page = Number(req.query.page);
    const type = req.query.type;
    const users = await User.find({type: type}).populate().skip(page).limit(1)
    res.send({
        status  : true,
        message : null,
        data    : users
    })
})

router.post("/page", async (req, res) => {
    const {type} = req.body;
    console.log(type);
    await User.countDocuments({type: type}, (err, result) => {
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
  

router.post('/facebook', function(req, res) {
    const {token, fcm_token} = req.body;
    console.log(token);
    https.get("https://graph.facebook.com/me?fields=id,name,email,picture&access_token=" 
        + token 
        + "&client_id=" + configAuth.facebookAuth.clientID
        + "&client_secret=" + configAuth.facebookAuth.clientSecret
        + "&grant_type=client_credentials", function (response) {
        response.setEncoding('utf-8');
        response.on('data', async function (chunk) {
            const jsonInfo = JSON.parse(chunk);
            const id = jsonInfo.id;
            const user = await User.findOne({"social_id" : id});
            if (!user)  {
                var newUser = User();
                newUser.social_id = jsonInfo.id;
                newUser.name = jsonInfo.name;
                newUser.email = jsonInfo.email;
                newUser.img_avatar = jsonInfo.picture.data.url;
                const token = await newUser.generateAuthToken()
                newUser.token = token
                newUser.fcm_token = fcm_token
                await newUser.save()
                res.send({
                    status: true,
                    message: "success",
                    data: newUser
                });
            } else {
                const token = await user.generateAuthToken()
                user.token = token
                user.fcm_token = fcm_token
                await user.save()
                res.send({
                    status: true,
                    message: "success",
                    data: user
                });
            }
        });
    }).on('error', (e) => {
        console.error(e);
    });
});

router.post('/google', function(req, res) {
    const {token, fcm_token} = req.body;
    https.get("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" 
        + token , function (response) {
        response.setEncoding('utf-8');
        // console.log(response);
        response.on('data', async function (chunk) {
            const jsonInfo = JSON.parse(chunk);
            console.log(chunk);
            const id = jsonInfo.sub;
            const user = await User.findOne({"social_id" : id});
            if (!user)  {
                var newUser = User();
                newUser.social_id = jsonInfo.sub;
                newUser.name = jsonInfo.name;
                newUser.email = jsonInfo.email;
                newUser.img_avatar = jsonInfo.picture;
                newUser.fcm_token = fcm_token;
                newUser.type = "student";
                await newUser.generateAuthToken()
                res.send({
                    status: true,
                    message: "success",
                    data: newUser
                });
            } else {
                user.fcm_token = fcm_token
                await user.generateAuthToken()
                res.send({
                    status: true,
                    message: "success",
                    data: user
                });
            }
        });
    }).on('error', (e) => {
        // console.error(e);
    });
});


//admin
router.get("/admin/all_teacher", async (req, res) => {
    const users = await User.find({type: "teacher"}).populate()
    res.send({
        status  : true,
        message : null,
        data    : users
    })
})

module.exports = router;