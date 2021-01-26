const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Notification = mongoose.model("Notification");
const UserJoinCourse = mongoose.model("UserJoinCourse");
const admin = require("firebase-admin");
let serviceAccount = require("../ctct-16b49-firebase-adminsdk-8lesv-5eba9083a5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ctct-16b49.firebaseio.com",
});

var payload = {
  notification: {
    title: "This is a Notification",
    priority: "high",
    important: "max",
    content_available: "true",
    body: "This is the body of the notification message.",
  },
};

var options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

router.get("/", auth, async (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const idUser = req.user._id;
  const listCourseUserJoin = await UserJoinCourse.find({user: idUser});
  const listIdCourse = listCourseUserJoin.map((e) => e.course);
  const list_result = await Notification.find({$or:[{ id_user: req.user._id}, {id_course: listIdCourse}]}).skip(offset).limit(limit);
  res.send({
    status: true,
    message: null,
    data: list_result,
  });
});

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
  admin
    .messaging()
    .sendToDevice(
      "fxrNJL-UjEFMl6Lr0vEq79:APA91bFX5zDF2yt8SvOI2BhCyee2LscvOJMoG1We9hHi3CA5zxoYX7xB9LRhIldH-DW4EgOSa7wDaWhVm_Uf7BUOG6rGpllEzbdTF5tF2n_dmvm0hM2CLsP8nvN6g_aTAquEavFee-PK",
      payload,
      options
    )
    .then(function (response) {
      console.log("Successfully sent message:", response);
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
    });
  res.send({
    status: true,
    message: null,
    data: "Success",
  });
});

module.exports = router;
