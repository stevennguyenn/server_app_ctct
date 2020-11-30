const router = require("express").Router();
const mongoose = require("mongoose");
const Subject = mongoose.model("Subject");
const UserJoinSubject = mongoose.model("UserJoinSubject");
var ObjectID = require("mongodb").ObjectID;
const Course = mongoose.model("Course");
const UserJoinCourse = mongoose.model("UserJoinCourse");
var ObjectID = require("mongodb").ObjectID;
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const userId = req.query.user_id;
  const subjects = await Subject.find({});
  //   var listSubjectUserJoin = [];
  //   if (userId != "" && userId != null) {
  //     const resultUserJoinSubject = await UserJoinSubject.find({
  //       user: ObjectID(userId),
  //     });
  //     listSubjectUserJoin = resultUserJoinSubject.map(function (e) {
  //       return e.subject;
  //     });
  //   }
  //   var statusJoin = [];
  //   for (const item in subjects) {
  //     if (userId == "" || userId == null) {
  //       statusJoin.push(0);
  //       continue;
  //     }
  //     if (listSubjectUserJoin.includes(item._id)) {
  //       statusJoin.push(2);
  //     } else {
  //       statusJoin.push(1);
  //     }
  //   }
  res.send({
    status: true,
    message: null,
    data: subjects,
  });
});

router.get("/:idSubject", auth, async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  const courses = await Course.find({
    id_subject: ObjectID(req.params.idSubject),
  }).populate({path: "author", select: "_id name img_avatar"});
  var listCourseUserJoin = [];
  if (userId != "" && userId != null) {
    const resultUserJoinCourse = await UserJoinCourse.find({
      user: ObjectID(userId),
    });
    listCourseUserJoin = resultUserJoinCourse.map(function (e) {
      return e.course;
    });
  }
  var statusJoin = [];
  for (const item in courses) {
    if (userId == "" || userId == null) {
      statusJoin.push(0);
      continue;
    }
    if (listCourseUserJoin.includes(item._id)) {
      statusJoin.push(2);
    } else {
      statusJoin.push(1);
    }
  }
  res.send({
    status: true,
    message: null,
    data: {
      courses: courses,
      status_join: statusJoin,
    },
  });
});

router.post("/", async (req, res) => {
  const { name, courses } = req.body;
  const subject = new Subject();
  subject.name = name;
  subject.courses = courses;
  await subject.save();
  res.send({
    status: true,
    message: null,
    data: "Success",
  });
});

module.exports = router;
