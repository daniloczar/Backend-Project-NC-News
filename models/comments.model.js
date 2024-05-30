const db = require("../db/connection.js");
exports.selectArticleCommentsByArticleId = (article_id) => {
  let queryString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows;
  });
};
exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

exports.insertCommentByArticleId = (article_id, username, body) => {
  if (typeof body !== "string" || typeof username !== "string") {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(
      `
    INSERT INTO comments
    (body, author, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *`,
      [body, username, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};


