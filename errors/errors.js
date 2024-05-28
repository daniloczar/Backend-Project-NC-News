exports.customErrors = (error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else next(error);
};

exports.psqlErrors = (error, request, response, next) => {
  if (error.code) {
    response.status(400).send({ msg: "Bad Request" });
  } else next(error);
};

exports.serverErrors = (error, request, response, next) => {
  response.status(500).send({ msg: "Internal Server Error" });
};

