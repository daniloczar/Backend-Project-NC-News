const { selectUsers, sellectUserByUsername} = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((error) => {
      next(console.log(error));
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  sellectUserByUsername(username)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};
