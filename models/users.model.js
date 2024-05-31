const db = require("../db/connection");

exports.checkUserExists = (username) => {
  return db
    .query(
      `SELECT username 
         FROM users 
         WHERE username = $1`,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Username does not exist!",
        });
      }
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};
