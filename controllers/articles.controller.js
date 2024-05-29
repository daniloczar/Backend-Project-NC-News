const { selectArticlesId, selectAllArticles } = require('../models/articles.model')

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

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then((allArticles)=>{
        res.status(200).send({allArticles})
    })
    .catch((error)=>{
        next(error)
    })
}