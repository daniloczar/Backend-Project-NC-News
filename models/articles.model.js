const db = require("../db/connection.js");

exports.selectArticlesId = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
  WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
        
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Bad Request" });
      } else {
        return rows[0];
      }
    });
};
