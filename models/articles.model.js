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

exports.selectAllArticles = (
  author,
  title,
  topic,
  created_at,
  votes,
  article_img_url,
  comment_count,
  sort_by = "created_at",
  order = "desc"
) => {
  const validSortColumns = [
    "author",
    "title",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrderColumns = ["asc", "ASC", "desc", "DESC"];

  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid Sort Query" });
  }

  if (!validOrderColumns.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Order Query" });
  }

  let querySql = `SELECT articles.author, articles.title, articles.article_id,
  articles.topic, articles.created_at, articles.votes, 
  articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count 
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id `;

  const queryValues = [];

  if (topic) {
    querySql += `WHERE topic = $1 `;
    queryValues.push(topic);
  }

  if (author) {
    if (queryValues.length) {
      querySql += `AND `;
    } else {
      querySql += `WHERE `;
    }
    queryValues.push(author);
    querySql += `articles.author = $${queryValues.length} `;
  }

  if (title) {
    if (queryValues.length) {
      querySql += `AND `;
    } else {
      querySql += `WHERE `;
    }
    queryValues.push(title);
    querySql += `articles.title = $${queryValues.length} `;
  }

  if (created_at) {
    if (queryValues.length) {
      querySql += `AND `;
    } else {
      querySql += `WHERE `;
    }
    queryValues.push(created_at);
    querySql += `articles.created_at = $${queryValues.length} `;
  }

  if (votes) {
    if (queryValues.length) {
      querySql += `AND `;
    } else {
      querySql += `WHERE `;
    }
    queryValues.push(votes);
    querySql += `articles.votes = $${queryValues.length} `;
  }

  if (article_img_url) {
    if (queryValues.length) {
      querySql += `AND `;
    } else {
      querySql += `WHERE `;
    }
    queryValues.push(article_img_url);
    querySql += `articles.article_img_url = $${queryValues.length} `;
  }

  if (comment_count) {
    if (queryValues.length) {
      querySql += `AND `;
    } else {
      querySql += `WHERE `;
    }
    queryValues.push(comment_count);
    querySql += `articles.comment_count = $${queryValues.length} `;
  }
  querySql += `GROUP BY articles.article_id `;

  if (sort_by || order) {
    querySql += `
    ORDER BY articles.${sort_by} ${order}`;
  }

  querySql += ";";

  return db.query(querySql, queryValues).then(({ rows: articles }) => {
    return articles;
  });
};

exports.updateArticlesById = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows: updatedArticle }) => {
      if (updatedArticle[0] === undefined) {
        return Promise.reject({ status: 404, msg: "Article ID Not Found" });
      }
      return updatedArticle[0];
    });
};
