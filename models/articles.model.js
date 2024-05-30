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

exports.selectAllArticles = (topic) => {
  let queryString = `SELECT articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
    CAST(COUNT(comment_id) AS INT) 
    AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id`;

  const queryValues = [];

  if (topic) {
    queryString += ` WHERE topic = $1 `;
    queryValues.push(topic);
  }

  queryString += ` GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`;
  return db
    .query(queryString, queryValues)
    .then(({ rows }) => {
      if (!rows.length && topic) {
        return checkTopicExists(topic);
      }
      return rows;
    })
    .then((rows) => {
      return rows;
    });
};
const checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({rows}) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "topic not found" });
      } else {
        return [];
      }
    });
};

exports.updateArticlesById = (article_id, newVote) => {
  const votes = newVote.inc_votes;
  return db
    .query(
      `UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;`,
      [votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
      return rows[0];
    });
};
