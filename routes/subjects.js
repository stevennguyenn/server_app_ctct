const router = require("express").Router();
const mongoose = require("mongoose");
const Subject = mongoose.model("Subject");
const ObjectID = require("mongodb").ObjectID;
const Course = mongoose.model("Course");
const UserJoinCourse = mongoose.model("UserJoinCourse");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const subjects = await Subject.find({}).skip(offset).limit(limit);
  res.send({
    status: true,
    message: null,
    data: subjects,
  });
});

router.get("/subject/:id_subject", async (req, res) => {
  const id_subject = req.params.id_subject;
  const subjects = await Subject.find({}).skip(offset).limit(limit);
  res.send({
    status: true,
    message: null,
    data: subjects,
  });
});

router.get("/:idSubject", auth, async (req, res) => {
  const userId = req.user._id;
  const courses = await Course.find({
    id_subject: ObjectID(req.params.idSubject),
  }).populate({ path: "author", select: "_id name img_avatar" });
  var listCourseUserJoin = [];
  const resultUserJoinCourse = await UserJoinCourse.find({
    user: userId,
  });
  listCourseUserJoin = resultUserJoinCourse.map(function (e) {
    return e.course.toString();
  });
  var statusJoin = [];
  for (const index in courses) {
    console.log(courses[index]._id.toString());
    if (listCourseUserJoin.includes(courses[index]._id.toString())) {
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

router.get("/teacher/:techer_id", auth, async (req, res) => {
  const techer_id = req.params.techer_id;
  const user_id = req.user._id;
  const courses = await Course.find({
    author: ObjectID(techer_id),
  }).populate({ path: "author", select: "_id name img_avatar" });
  var listCourseUserJoin = [];
  const resultUserJoinCourse = await UserJoinCourse.find({
    user: user_id,
  });
  listCourseUserJoin = resultUserJoinCourse.map(function (e) {
    return e.course.toString();
  });
  var statusJoin = [];
  for (const index in courses) {
    console.log(courses[index]._id.toString());
    if (listCourseUserJoin.includes(courses[index]._id.toString())) {
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

router.post("/user_join_course", auth, async (req, res) => {
  const { course_id } = req.body;
  const user_id = req.user._id;
  const userJoinCourse = new UserJoinCourse();
  userJoinCourse.user = user_id;
  userJoinCourse.course = course_id;
  await userJoinCourse.save();
  const course = await Course.findById(course_id);
  course.students = course.students + 1;
  await course.save();
  res.send({
    status: true,
    message: null,
    data: userJoinCourse,
  });
});

router.delete("/user_leave_course/:course_id", auth, async (req, res) => {
  const course_id = req.params.course_id;
  const user_id = req.user._id;
  await UserJoinCourse.deleteOne({
    $and: [{ course: ObjectID(course_id) }, { user: ObjectID(user_id) }],
  });
  const course = await Course.findById(course_id);
  course.students = course.students - 1;
  await course.save();
  res.send({
    status: true,
    message: null,
    data: true,
  });
});

router.get(
  "/get_status_user_join_course/:course_id",
  auth,
  async (req, res) => {
    const course_id = req.params.course_id;
    const user_id = req.user._id;
    const result = await UserJoinCourse.find({
      $and: [{ course: ObjectID(course_id) }, { user: ObjectID(user_id) }],
    });
    var status = 1;
    if (result.length > 0) {
      status = 2;
    }
    res.send({
      status: true,
      message: null,
      data: status,
    });
  }
);

//for admin
router.get("/admin/subject", async (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const resultPage = await Subject.countDocuments({})
  const page = parseInt(resultPage / limit, 10) + 1
  const subjects = await Subject.find({})
    .populate()
    .skip(offset)
    .limit(limit);
  res.send({
    status: true,
    message: null,
    meta: {
      "page": page
    },
    data: subjects,
  });
})

//for admin
router.get("/admin/all/subject", async (req, res) => {
  const subjects = await Subject.find({}).populate()
  res.send({
    status: true,
    message: null,
    data: subjects,
  });
})

module.exports = router;
