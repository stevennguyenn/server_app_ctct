const router = require("express").Router();
const mongoose = require("mongoose");
const Theory = mongoose.model("Theory");
const Like = mongoose.model("Like");
const auth = require("../middleware/auth");
const Exercise = require("../models/exercise/Exercise");
const Question = require("../models/exercise/Question");
var ObjectID = require("mongodb").ObjectID;

router.get("/", async (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const questions = await Question.find({})
    .populate({
        path: "theory", 
        select: "name",
        populate: {
            path: "course",
            select: "name"
        }
    })
    .skip(offset)
    .limit(limit);
  res.send({
    status: true,
    message: null,
    data: questions,
  });
});

//for admin
router.get("/admin/all_question", async (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const resultPage = await Question.countDocuments({})
  const page = parseInt(resultPage / limit, 10) + 1;
  const theories = await Question.find({})
    .populate({
      path: "theory",
      populate: {
        path: "course",
        select: "name"
      },
      select: "name"
    })
    .select("-user -options")
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


//for admin
router.post("/admin/create", async (req, res) => {
  const {
    content,
    options,
    type,
    answer,
    theory,
    level,
    explanation
  } = req.body
  const question = Question()
  question.content = content
  question.options = options
  question.type = type
  question.answer = answer
  question.theory = theory
  question.level = level
  question.explanation = explanation
  await question.save()
  res.send({
    status: true,
    message: null,
    data: question,
  });
});

module.exports = router;
