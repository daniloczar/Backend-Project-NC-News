const { selectAllTopics } = require('../models/topics.model');
const endpoints = require('../endpoints.json')

exports.getAllTopics = (req, res, next) => {
    selectAllTopics()
    .then((ArrTopics) => {
        res.status(200).send({ArrTopics})
    }).catch((error)=>{
        next(error)
    })
}

exports.getAllEndPoints = (req, res, next) => {
        res.status(200).send({endpoints})
        .catch((error) => {
        next(error)
    })
}