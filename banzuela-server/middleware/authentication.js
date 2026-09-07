const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/config");
const { HttpStatus } = require("../config/constants");

module.exports = async (request, response, next) => {
  try {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        error: new Error("Invalid Request!"),
      });
    }

    const decodedToken = await jwt.verify(token, SECRET_KEY);

    request.user = decodedToken;

    next();
  } catch (error) {
    return response.status(HttpStatus.UNAUTHORIZED).json({
      error: new Error("Invalid request!"),
    });
  }
};