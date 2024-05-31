const db = require("../db/connection.js");

exports.selectArticlesId = (article_id) => {
  return db
    .query(
    `SELECT 
    articles.*, 
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
        return rows[0];
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
    queryString += ';'
  return db
    .query(queryString, queryValues)
    .then(({ rows }) => {
      return rows;
    })
}

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
      return rows[0];
    });
};
