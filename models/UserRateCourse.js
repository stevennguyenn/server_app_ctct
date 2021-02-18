const mongoose = require("mongoose");

const user_rate_course_schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  rate: {
    type: Number,
    required: true,
  },
  __v: {
    type: Number,
    select: false,
  },
});

module.exports = mongoose.model("UserRateCourse", user_rate_course_schema);
