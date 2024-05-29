const { selectArticlesId } = require('../models/articles.model')

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
    selectArticlesId(article_id)
    .then((article)=>{
        res.status(200).send({article})
    })
    .catch((error)=>{
        next(error)
    })
};
