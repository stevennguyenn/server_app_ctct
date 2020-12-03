const router = require("express").Router();
const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;
const Course = mongoose.model("Course");

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

module.exports = router;
