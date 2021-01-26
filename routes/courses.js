const router = require("express").Router();
const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;
const Course = mongoose.model("Course");
const auth = require("../middleware/auth");
const UserJoinCourse = mongoose.model("UserJoinCourse");

router.get("/", async (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const courses = await Course.find({})
  .populate({ path: "author", select: "_id name img_avatar" })
  .populate({ path: "id_subject", select: "_id name" })
  .skip(offset).limit(limit);
  res.send({
    status: true,
    message: null,
    data: courses,
  });
});


router.get("/subject/:id_subject", async (req, res) => {
  const id_subject = req.params.id_subject;
  const courses = await Course.find({id_subject: id_subject})
  .populate({ path: "author", select: "_id name img_avatar" })
  .populate({ path: "id_subject", select: "_id name" })
  res.send({
    status: true,
    message: null,
    data: courses,
  });
});


router.post("/page", async (req, res) => {
    await Course.countDocuments({}, (err, result) => {
        if (err)    {
            console.log(err)
            res.send(500)
        }
        res.send({
            status: true,
            message: null,
            data: parseInt(result / process.env.limit, 10) + 1
        })
    })
  })

  router.post("/userjoin", auth, async (req, res) => {
    let userId = req.user._id;
    const courses = await UserJoinCourse.find({user: userId}).populate({ path: "course", select: "_id name img_avatar" })
    res.send({
      status: true,
      message: null,
      data: courses.map((e) => e.course),
    });
  })


module.exports = router;
