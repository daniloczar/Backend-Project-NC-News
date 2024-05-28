const express = require("express");
const { getAllTopics, getAllEndPoints } = require("./controllers/topics.controller");
const { customErrors, psqlErrors, serverErrors } = require('./errors/errors.js');
const app = express();

app.get("/api/topics", getAllTopics);
app.get('/api', getAllEndPoints)

app.use(customErrors);
app.use(psqlErrors);
app.use(serverErrors);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "Not found" });
});

module.exports = app;
