const {
  selectArticlesId,
  selectAllArticles,
  updateArticlesById,

} = require("../models/articles.model");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesId(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { topic } = req.query
  selectAllArticles(topic)
    .then((allArticles) => {
      res.status(200).send({ allArticles });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchUpdateArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req

  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  updateArticlesById(article_id, body)
    .then((upArticles) => {
      res.status(200).send({ upArticles });
    })
    .catch((error) => {
      next(error);
    });
};
