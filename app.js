const express = require("express");
const { getAllTopics, getAllEndPoints } = require("./controllers/topics.controller");
const {getArticlesById, getAllArticles } = require('./controllers/articles.controller')

const app = express();

app.get("/api/topics", getAllTopics);
app.get('/api', getAllEndPoints)
app.get('/api/articles/:article_id', getArticlesById)
app.get('/api/articles', getAllArticles)


app.all("*", (request, response) => {
  response.status(404).send({ msg: "Not found" });
});

module.exports = app;
