const {
  selectArticlesId,
  selectAllArticles,
  updateArticlesById,
} = require("../models/articles.model");
const { checkArticleExists } = require("../models/comments.model");
const { selectAllTopics } = require("../models/topics.model");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [selectArticlesId(article_id)];

  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }
  Promise.all(promises)

    .then((resolvedPromise) => {
      const article = resolvedPromise[0]
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getAllArticles = (req, res, next) => {
  const {
    author,
    title,
    topic,
    created_at,
    votes,
    article_img_url,
    comment_count,
    sort_by,
    order,
  } = req.query;

  const promises = [
    selectAllArticles(
      author,
      title,
      topic,
      created_at,
      votes,
      article_img_url,
      comment_count,
      sort_by,
      order
    ),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      const allArticles = resolvedPromises[0];
      res.status(200).send({ allArticles });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchUpdateArticleById = (req, res, next) => {
  const { article_id } = req.params;
   const { inc_votes } = req.body;

  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  updateArticlesById(article_id, inc_votes)
    .then((upArticles) => {
      res.status(200).send({ upArticles });
    })
    .catch((error) => {
      next(error);
    });
};
