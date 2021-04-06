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
  // const listCourseUserJoin = await UserJoinCourse.find({user: idUser});
  // const listIdCourse = listCourseUserJoin.map((e) => e.course);
  const list_result = await Notification.find({$or:[{ id_user: req.user._id}, {type: "all"}]}).skip(offset).limit(limit);
  res.send({
    status: true,
    message: null,
    data: list_result,
  });
});

router.delete("/admin/:id", async (req, res) => {
  const id = req.params.id
  await Notification.deleteOne({_id: id})
  res.send({
    status: true,
    message: null,
    data: true,
  });
});

router.post("/admin/create", async (req, res) => {
  const {title, message} = req.body
  const notification = Notification()
  notification.title = title
  notification.message = message
  // admin
  //   .messaging()
  //   .sendToDevice(
  //     "fxrNJL-UjEFMl6Lr0vEq79:APA91bFX5zDF2yt8SvOI2BhCyee2LscvOJMoG1We9hHi3CA5zxoYX7xB9LRhIldH-DW4EgOSa7wDaWhVm_Uf7BUOG6rGpllEzbdTF5tF2n_dmvm0hM2CLsP8nvN6g_aTAquEavFee-PK",
  //     payload,
  //     options
  //   )
  //   .then(function (response) {
  //     console.log("Successfully sent message:", response);
  //   })
  //   .catch(function (error) {
  //     console.log("Error sending message:", error);
  //   });
  await notification.save();
  res.send({
    status: true,
    message: "Success",
    data: notification,
  });
});

//for admin
router.get("/admin/all_notification", async (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const resultPage = await Notification.countDocuments({})
  const page = parseInt(resultPage / limit, 10) + 1;
  const theories = await Notification.find({})
    .populate()
    .skip(offset)
    .limit(limit);
  res.send({
    status: true,
    message: null,
    meta: {
      "page": page
    },
    data: theories,
  });
});

module.exports = router;
