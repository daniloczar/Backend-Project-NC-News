const db = require("../db/connection.js");
const fs = require("fs/promises");

exports.selectAllTopics = () => {
  return db.query("SELECT * FROM topics").then((res) => {
    return res.rows;
  });
};

exports.selectAllEndpoints = () => {
  return fs.readFile("./endpoints.json", "UTF-8").then((response) => {
    const parsedEndpoints = JSON.parse(response);
    return parsedEndpoints;
  });
};
