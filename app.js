const cors = require('cors')
const express = require("express");
const {
  getAllTopics,
  getAllEndPoints,
} = require("./controllers/topics.controller");
const {
  getArticlesById,
  getAllArticles,
  patchUpdateArticleById,
} = require("./controllers/articles.controller");
const {
  getArticleCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("./controllers/comments.controller");
const { getUsers, getUserByUsername } = require("./controllers/users.controller");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"]
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

app.options("*", (req, res) => {
  console.log("preflight");
  if (
    req.headers.origin ===
      "https://backend-project-nc-news-z6wy.onrender.com" &&
    allowMethods.includes(req.headers["access-control-request-method"]) &&
    allowHeaders.includes(req.headers["access-control-request-headers"])
  ) {
    console.log("pass");
    return res.status(204).send();
  } else {
    console.log("fail");
  }
  })

  app.get("/healthz", (req, res) => {
    console.log("health check is processed");
    return res.status(204).send();
  });
const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api", getAllEndPoints);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getArticleCommentsByArticleId);
app.get("/api/users", getUsers);
app.get("/api/user/:username", getUserByUsername)

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchUpdateArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);



//customError
app.use((error, req, res, next) => {
  if (error.status && error.msg) {
    res.status(error.status).send({ msg: error.msg });
  } else next(error);
});

//psqlError
app.use((error, req, res, next) => {
  if (error.code === "22P02" || error.code === "23502") {
    res.status(400).send({ msg: error.msg || "Bad Request" });
  } else if (error.code === "23503") {
    res.status(404).send({ msg: error.msg || "User input not found" });
  } else next(error);
});

app.all("*", (request, response) => {
  response.status(404).send({ msg: "Not found" });
});

module.exports = app;
