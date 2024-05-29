const express = require("express");
const {
  getAllTopics,
  getAllEndPoints,
} = require("./controllers/topics.controller");
const {
  getArticlesById,
  getAllArticles,
  getArticleCommentsByArticleId,
} = require("./controllers/articles.controller");

const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api", getAllEndPoints);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getArticleCommentsByArticleId);

app.use((error, req, res, next) => {
  if (error.status && error.msg) {
    res.status(error.status).send({ msg: error.msg });
  } else next(error);
});

app.use((error, req, res, next) => {
    if (error.code) {
      res.status(400).send({ msg: "Bad Request" });
    } else next(error);
});

app.all("*", (request, response) => {
  response.status(404).send({ msg: "Not found" });
});

module.exports = app;
