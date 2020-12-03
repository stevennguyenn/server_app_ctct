const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");
const auth = require("../middleware/auth");
var ObjectID = require("mongodb").ObjectID;

router.get("/", auth, async (req, res) => {
  const id = req.query.id;
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const comments = await Comment.find({
    $and: [{ id_content: id }, { is_parent: true }],
  })
    .populate({
      path: "children",
      populate: {
        path: "user",
        select: "_id name email img_avatar",
      },
    })
    .populate({
      path: "user",
      select: "_id name email img_avatar",
    })
    .skip(offset)
    .limit(limit);
  res.send({
    status: true,
    message: null,
    data: comments,
  });
});

router.post("/", auth, async (req, res) => {
  const id_user = req.user._id;
  const { id, id_parent, content, type } = req.body;
  const comment = new Comment();
  comment.user = id_user;
  comment.content = content;
  comment.id_content = id;
  comment.type = type;
  comment.children = [];
  if (id_parent == null) {
    comment.is_parent = true;
    await comment.save();
  } else {
    const parent_comment = await Comment.findOne({ _id: id_parent });
    comment.is_parent = false;
    await comment.save();
    parent_comment.children.push(comment);
    await parent_comment.save();
  }
  const commentPopulate = await Comment.populate(comment, {
    path: "user",
    select: "_id name email",
  });
  res.send({
    status: true,
    message: "Successful",
    data: commentPopulate,
  });
});

module.exports = router;
