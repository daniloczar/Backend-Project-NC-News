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
  order = "desc",
  limit = 10,
  p = 1
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

  if (isNaN(limit) || limit <= 0) {
    return Promise.reject({ status: 400, msg: "Invalid Limit Query" });
  }

  if (isNaN(p) || p <= 0) {
    return Promise.reject({ status: 400, msg: "Invalid Page Query" });
  }

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
  const countQueryValues = [];

  const filterTitles = (label, value) => {
    if (queryValues.length) {
      queryString += ` AND `;
    } else {
      queryString += ` WHERE `;
    }
    queryValues.push(value);
    countQueryValues.push(value);
    queryString += `articles.${label} = $${queryValues.length} `;
  };

  if (topic) filterTitles("topic", topic);
  if (author) filterTitles("author", author);
  if (title) filterTitles("title", title);
  if (created_at) filterTitles("created_at", created_at);
  if (votes) filterTitles("votes", votes);
  if (article_img_url) filterTitles("article_img_url", article_img_url);

  queryString += `GROUP BY articles.article_id `;

  if (sort_by && order) {
    queryString += `ORDER BY articles.${sort_by} ${order} `;
  }

  queryString += `LIMIT $${queryValues.length + 1} OFFSET $${
    queryValues.length + 2
  };`;

  const totalQuery = `
    SELECT COUNT(*) FROM articles
    ${
      countQueryValues.length
        ? "WHERE " +
          countQueryValues
            .map((_, index) => `articles.${validSortColumns[index]} = $${index + 1}`)
            .join(" AND ")
        : ""
    }
  `;

  return Promise.all([
    db.query(totalQuery, countQueryValues),
    db.query(queryString, [...queryValues, limit, (p - 1) * limit]),
  ]).then(([totalResult, result]) => {
    return {
      total_count: parseInt(totalResult.rows[0].count, 10),
      articles: result.rows,
    };
  });
};

exports.updateArticlesById = (article_id, body) => {
  return db
    .query("SELECT votes FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      const currentVotes = rows[0].votes;
      const increment = body.inc_votes;
      const updatedVotes = currentVotes + increment;
      if (updatedVotes < 0) {
        return Promise.reject({
          status: 400,
          msg: `We're not popular enough to subtract that amount! We only have ${currentVotes} votes!`,
        });
      } else {
        return db
          .query(
            "UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *",
            [updatedVotes, article_id]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      }
    });
};
