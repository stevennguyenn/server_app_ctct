const express = require("express");
require("express-async-errors");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

//database
require("./mongo");
//models
require("./models/Comment");
require("./models/user/User");
require("./models/Course");
require("./models/subject/Subject");
require("./models/UserJoinCourse");
require("./models/theory/Theory");
require("./models/UserRateCourse");
require("./models/Image");
require("./models/exercise/Exercise");
require("./models/exercise/Question");
require("./models/result/Result");
require("./models/video/Video");
require("./models/Like");
require("./models/notification/Notification");
require("./models/ReferenceCourse");

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

//routes
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/users", require("./routes/users"));
app.use("/theories", require("./routes/theories"));
app.use("/courses", require("./routes/courses"));
app.use("/comments", require("./routes/comments"));
app.use("/upload", require("./routes/upload"));
app.use("/exercises", require("./routes/exercises"));
app.use("/results", require("./routes/results"));
app.use("/videos", require("./routes/videos"));
app.use("/subjects", require("./routes/subjects"));
app.use("/questions", require("./routes/questions"));
app.use("/notifications", require("./routes/notifications"));
app.use("/reference_course", require("./routes/reference_course"));
app.use(express.static(__dirname));

//not found router
app.use((req, res, next) => {
  req.status = 404;
  const error = new Error("URL not found");
  next(error);
});

//errors handler
if (app.get("env") == "production") {
  app.use((error, req, res, next) => {
    res.status(req.status || 500).send({
      status: false,
      message: error.message,
    });
  });
} else {
  app.use((error, req, res, next) => {
    res.status(req.status || 500).send({
      status: false,
      message: error.message,
      stack: error.stack,
    });
  });
}

app.listen(process.env.PORT || 3000, function () {
  console.log("Server listen port " + process.env.PORT);
});
