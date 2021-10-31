const router = require("express").Router();
const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;
const Course = mongoose.model("Course");
const Theory = mongoose.model("Theory");
const UserLikeCourse = mongoose.model("Like");
const UserRateCourse = mongoose.model("UserRateCourse");
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


router.get("/more_info/:id_course", auth, async (req, res) => {
  const id_course = req.params.id_course; 
  const likeCourse = await UserLikeCourse.find({$and: [{id_user: req.user._id}, {id_content: id_course}]})
  const rateCourse = await UserRateCourse.find({$and: [{user: req.user._id}, {course: id_course}]})
  // const likeCourse = await UserLikeCourse.find({id_content: id_course})
  // const rateCourse = await UserRateCourse.find({course: id_course})
  const result = {
    "like": likeCourse != null && likeCourse.length > 0 ? true : false,
    "rate": rateCourse != null && rateCourse.length > 0 ? true : false
  }
  res.send({
    status: true,
    message: null,
    data: result,
  });
});

router.post("/user_like_course", auth, async (req, res) => {
  const {id_course, is_like} = req.body;
  const id_user = req.user._id; 
  if (is_like) {
    const like = UserLikeCourse()
    like.id_user = id_user
    like.id_content = id_course
    like.type = "course"
    await like.save()
    const course = await Course.findOne({_id: id_course})
    const numberLike = course.like
    course.like = numberLike + 1
    await course.save()
    res.send({
      status: true,
      message: null,
      data: course.like,
    });
  } else {
    await UserLikeCourse.deleteOne({
      $and: [{ id_user: id_user }, { id_content: id_course}],
    });
    const course = await Course.findOne({_id: id_course})
    const numberLike = course.like;
    if (numberLike > 0) {
      course.like = numberLike - 1
    }
    await course.save()
    res.send({
      status: true,
      message: null,
      data: course.like,
    });
  }
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

router.post("/userjoin", auth, async (req, res) => {
  let userId = req.user._id;
  const courses = await UserJoinCourse.find({user: userId}).populate({ path: "course", populate: {
    path: "author",
    select: "_id name email img_avatar",
  },})
  res.send({
    status: true,
    message: null,
    data: courses.map((e) => e.course),
  });
})

//for admin
router.get("/admin/all_course", async (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const resultPage = await Course.countDocuments({})
  const page = parseInt(resultPage / limit, 10) + 1;
  const theories = await Course.find({})
    .populate({ path: "author", select: "_id name img_avatar" })
    .populate({ path: "id_subject", select: "_id name" })
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
router.get("/admin/all/course", async (req, res) => {
  const courses = await Course.find({})
    .populate({ path: "author", select: "_id name img_avatar" })
    .populate({ path: "id_subject", select: "_id name" })
  res.send({
    status: true,
    message: null,
    data: courses,
  });
});

//for admin
router.delete("/admin/delete/:id", async (req, res) => {
  const id = req.params.id
  await Course.deleteOne({_id: id})
  await UserJoinCourse.deleteMany({course: id})
  res.send({
    status: true,
    message: null,
    data: true,
  });
});


//for admin
router.post("/admin/create", async (req, res) => {
  const {
    name,
    id_subject,
    author,
    intro,
    struct,
    service,
    goal,
    images
  } = req.body
  const course = Course()
  course.id_subject = id_subject
  course.author = author
  course.name = name
  course.intro = intro
  course.struct = struct
  course.service = service
  course.goal = goal
  course.images = images
  await course.save()
  res.send({
    status: true,
    message: null,
    data: course,
  });
});

router.post("/admin/edit", async (req, res) => {
  const {
    name,
    id
  } = req.body
  const course = await Course.findById(id)
  course.name = name
  await course.save()
  res.send({
    status: true,
    message: null,
    data: course,
  });
});

router.get("/admin/:id", async (req, res) => {
  const id = req.params.id
  const course = await Course.findById(id)
  res.send({
    status: true,
    message: null,
    data: course,
  });
});

module.exports = router;
