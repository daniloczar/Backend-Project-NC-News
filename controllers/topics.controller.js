const { selectAllTopics, selectAllEndpoints } = require('../models/topics.model');

exports.getAllTopics = (req, res, next) => {
    selectAllTopics()
    .then((ArrTopics) => {
        res.status(200).send({ArrTopics})
    }).catch((error)=>{
        next(error)
    })
}

exports.getAllEndPoints = (req, res, next) => {
    selectAllEndpoints()
    .then((endPoints) => {
        res.status(200).send({endPoints})
    }).catch((error) => {
        next(error)
    })
}