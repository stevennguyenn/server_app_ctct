const router = require("express").Router();
const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;
const Course = mongoose.model("Course");
const ReferenceCourse = mongoose.model("ReferenceCourse");
const auth = require("../middleware/auth");

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

module.exports = router;
