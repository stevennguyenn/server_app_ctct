const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Notification = mongoose.model("Notification");
const UserJoinCourse = mongoose.model("UserJoinCourse");
const User = mongoose.model("User")

const admin = require("firebase-admin");
let serviceAccount = require("../ctct-16b49-firebase-adminsdk-8lesv-5eba9083a5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ctct-16b49.firebaseio.com",
});

async function pushNotificationForAllUser(title, message) {
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
    console.log(fcm.slice(i, lastIndex))
    await admin.messaging().sendToDevice(fcm.slice(i, lastIndex), payload);
  }
  // console.log(allFcm)
}

async function pushUserJoinCourse(course, title, message, data) {
//   console.log("pudajdjakdhadhajdasdas")
  var payload = {
    notification: {
      title: title,
      priority: "high",
      important: "max",
      content_available: "true",
    //   data: "{test: test}",
      body: message,
      // timeToLive: 60 * 60 * 24,
    },
    data: data
  }
  const users = await UserJoinCourse.find({course: course}).populate("user").select("user")
//   console.log(users)
  const fcm = users.map((e) => e.user.fcm_token)
//   if (fcm.length == 0) { return } 
  console.log(fcm.length)
  for (i = 0; i < fcm.length; i += 1000) {
    var lastIndex = i + 1000
    if (lastIndex > fcm.length) {
        lastIndex = fcm.length;
    }
    // console.log("pusssshshhh")
    console.log(fcm.slice(i, lastIndex))
    await admin.messaging().sendToDevice(fcm.slice(i, lastIndex), payload);
  }
}

module.exports = {
  pushUserJoinCourse: pushUserJoinCourse,
  pushNotificationForAllUser: pushNotificationForAllUser
};
