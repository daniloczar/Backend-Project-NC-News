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

app.use(cors());

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
