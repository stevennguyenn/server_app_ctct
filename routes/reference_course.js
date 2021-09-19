const router = require("express").Router();
const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;
const Course = mongoose.model("Course");
const ReferenceCourse = mongoose.model("ReferenceCourse");
const auth = require("../middleware/auth");
const notification_utils = require("../utils/notification_utils");

router.get("/", async (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const id_course = req.query.id_course;
  const referenceCourses = await ReferenceCourse.find({id_course: id_course}).skip(offset).limit(limit);
  res.send({
    status: true,
    message: null,
    data: referenceCourses,
  });
});

router.post("/admin/create", async (req, res) => {
  const { id_course, title, message, url } = req.body;
  const referenceCourse = ReferenceCourse();
  referenceCourse.title = title;
  referenceCourse.message = message;
  referenceCourse.url = url;
  referenceCourse.id_course = id_course;
  await referenceCourse.save();
  notification_utils.pushUserJoinCourse(id_course, "Tài liệu tham khảo", "Tài liệu " + title + " vừa được cập nhât. Xem ngay!!!", {
    "course": id_course,
    "type" : "document",
    "id": referenceCourse.id
  })
  res.send({
    status: true,
    message: null,
    data: referenceCourse,
  });
});

router.delete("/admin/:id", async (req, res) => {
  const id = req.params.id;
  await ReferenceCourse.deleteOne({_id: id})
  res.send({
    status: true,
    message: null,
    data: true,
  });
});

module.exports = router;
