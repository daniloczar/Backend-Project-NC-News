const express = require("express");
const {
  getAllTopics,
  getAllEndPoints,
} = require("./controllers/topics.controller");
const {
  getArticlesById,
  getAllArticles,
  
} = require("./controllers/articles.controller");
const {
  getArticleCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/comments.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api", getAllEndPoints);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getArticleCommentsByArticleId);


app.post("/api/articles/:article_id/comments", postCommentByArticleId);

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
