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
       return Promise.reject({ status: 404, msg: "Not found" });
     } else {
       return rows[0];
     }
    });
};

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT 
      articles.article_id,
      articles.title,
      articles.topic, 
      articles.author, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      COUNT(comments.comment_id) AS comment_count 
      FROM articles LEFT JOIN comments 
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
      `
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((error) => {
      next(error);
    });
};

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