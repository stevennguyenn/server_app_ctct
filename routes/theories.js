const router = require("express").Router();
const mongoose = require("mongoose");
const Course = mongoose.model("Course");
const Theory = mongoose.model("Theory");
const LikeTheory = mongoose.model("LikeTheory");
const Comment = mongoose.model("Comment");
const auth = require("../middleware/auth");
const Exercise = require("../models/exercise/Exercise");
const Video = mongoose.model("Video");
var ObjectID = require("mongodb").ObjectID;

router.get("/", async (req, res) => {
  const id_course = req.query.id_course;
  const offset = Number(req.query.offset);
  const limit = Number(req.query);
  const theories = await Theory.find({ course: ObjectID(id_course) })
    .populate()
    .skip(offset)
    .limit(limit);
  res.send({
    status: true,
    message: null,
    data: theories,
  });
});

router.get("/:idTheory", auth, async (req, res) => {
  const idUser = req.user._id;
  const idTheory = req.params.idTheory;
  const theory = await Theory.findOne({ _id: idTheory });
  var liked = false;
  const isLike = await LikeTheory.findOne({
    $and: [{ id_user: idUser }, { id_theory: idTheory }],
  }).select("+like");
  if (isLike != null) {
    liked = true;
  }
  theory.like = liked;
  res.send({
    status: true,
    message: null,
    data: theory,
  });
});

router.post("/like", auth, async (req, res) => {
  const id_user = req.user._id;
  const { id_theory, like } = req.body;
  if (like) {
    const like = LikeTheory();
    like.id_user = id_user;
    like.id_theory = id_theory;
    await like.save();
  } else {
    await LikeTheory.deleteOne({
      $and: [{ id_user: id_user }, { id_theory: id_theory }],
    });
  }
  res.send({
    status: true,
    message: "Success",
  });
});

router.post("/relate_theory", auth, async (req, res) => {
  const { id_theory } = req.body;
  const videos = await Video.find({ theory: { $in: id_theory } });
  const exercises = await Exercise.find({ theory: { $in: id_theory } }).select(
    "name level type time"
  );
  const data = {
    videos: videos,
    exercises: exercises,
  };
  res.send({
    status: true,
    message: "Successful",
    data: data,
  });
});

module.exports = router;
