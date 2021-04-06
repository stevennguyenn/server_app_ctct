const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Notification = mongoose.model("Notification");
const UserJoinCourse = mongoose.model("UserJoinCourse");
const User = mongoose.model("User")
const notification_utils = require("../utils/notification_utils");

// const admin = require("firebase-admin");
// let serviceAccount = require("../ctct-16b49-firebase-adminsdk-8lesv-5eba9083a5.json");

// // admin.initializeApp({
// //   credential: admin.credential.cert(serviceAccount),
// //   databaseURL: "https://ctct-16b49.firebaseio.com",
// // });

// var payload = {
//   notification: {
//     title: "This is a Notification",
//     priority: "high",
//     important: "max",
//     content_available: "true",
//     body: "This is the body of the notification message.",
//   },
// };

// var options = {
//   priority: "high",
//   timeToLive: 60 * 60 * 24,
// };

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
  pushNotificationForAllUser(title, message)
  await notification.save()
  //make push notification
  res.send({
    status: true,
    message: "Success",
    data: notification,
  })
})

async function pushNotificationForAllUser(title, message) {
  // const allFcm = await User.find({}).select("fcm_token");
  var payload = {
    notification: {
      title: title,
      priority: "high",
      important: "max",
      content_available: "true",
      body: message,
      // timeToLive: 60 * 60 * 24,
    },
  }
  const users = await User.find({type: "student"})
  const fcm = users.map((e) => e.fcm_token)
  for (i = 0; i < fcm.length; i += 1000) {
    var lastIndex = i + 1000
    if (lastIndex > fcm.length) {
        lastIndex = fcm.length;
    }
    console.log("pusssshshhh")
    console.log(fcm.slice(i, lastIndex))
    await notification_utils.admin.messaging().sendToDevice(fcm.slice(i, lastIndex), payload);
  }
  // console.log(allFcm)
}

async function pushUserJoinCourse(course, title, message) {
  console.log("pudajdjakdhadhajdasdas")
  var payload = {
    notification: {
      title: title,
      priority: "high",
      important: "max",
      content_available: "true",
      data: {
        "test": "test"
      },
      body: message,
      // timeToLive: 60 * 60 * 24,
    },
  }
  const users = await UserJoinCourse.find({course: course}).populate("user").select("user")
  const fcm = users.map((e) => e.fcm_token)
  for (i = 0; i < fcm.length; i += 1000) {
    var lastIndex = i + 1000
    if (lastIndex > fcm.length) {
        lastIndex = fcm.length;
    }
    console.log("pusssshshhh")
    console.log(fcm.slice(i, lastIndex))
    await admin.messaging().sendToDevice(fcm.slice(i, lastIndex), payload);
  }
}

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