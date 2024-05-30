const {
  selectArticleCommentsByArticleId,
  checkArticleExists,
  insertCommentByArticleId,
  removeCommentById,
} = require("../models/comments.model");

exports.getArticleCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  checkArticleExists(article_id)
    .then(() => {
      return selectArticleCommentsByArticleId(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  checkArticleExists(article_id)
    .then(() => {
      return insertCommentByArticleId(article_id, username, body);
    })
    .then((postComment) => {
      res.status(201).send({ postComment });
    })
    .catch((error) => {
      next(error);
    });
};
exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
    removeCommentById(comment_id)
      .then(() => {
        res.status(204).end();
      })
      .catch((err) => {
        next(err);
      });
};
