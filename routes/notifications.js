const router = require("express").Router()
const mongoose = require("mongoose")
const auth = require("../middleware/auth")
const Notification = mongoose.model("Notification")
const admin = require('firebase-admin')
var serviceAccount = require("/Users/macbookair/Desktop/server_app_ctct/ctct-16b49-firebase-adminsdk-8lesv-5eba9083a5.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ctct-16b49.firebaseio.com"
});

var payload = {
    notification: {
      title: "This is a Notification",
      body: "This is the body of the notification message."
    }
  };
  
   var options = {
    priority: "high",
    timeToLive: 60 * 60 *24
};

router.post("/list_notification", auth, async (req, res) => {
    const {offset, limit} = req.body
    const list_result = await Notification.find({to: req.user._id}).populate({
        path: "from",
        select: "_id name img_avatar"
    })
    .populate({
        path: "to",
        select: "_id name img_avatar"
    })
    .skip(offset).limit(limit).sort({created_at: -1});
    res.send({
        status  : true,
        message : null,
        data    : list_result
    })
})

router.post("/create_notification", auth, async (req, res) => {
    // const {offset, limit} = req.body
    // const list_result = await Notification.find({to: req.user._id}).populate({
    //     path: "from",
    //     select: "_id name img_avatar"
    // })
    // .populate({
    //     path: "to",
    //     select: "_id name img_avatar"
    // })
    // .skip(offset).limit(limit).sort({created_at: -1});
    admin.messaging().sendToDevice("fxrNJL-UjEFMl6Lr0vEq79:APA91bFX5zDF2yt8SvOI2BhCyee2LscvOJMoG1We9hHi3CA5zxoYX7xB9LRhIldH-DW4EgOSa7wDaWhVm_Uf7BUOG6rGpllEzbdTF5tF2n_dmvm0hM2CLsP8nvN6g_aTAquEavFee-PK", payload, options)
    .then(function(response) {
        console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
        console.log("Error sending message:", error);
    });
    res.send({
        status  : true,
        message : null,
        data    : "Success"
    })
})

module.exports = router;