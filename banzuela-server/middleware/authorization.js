const { HttpStatus } = require("../config/constants");

module.exports = (...roles) => {
  return async (request, response, next) => {
    try {
      if (!request.user) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          error: new Error("Authentication required"),
        });
      }

      if (!roles.includes(request.user.role)) {
        return response.status(HttpStatus.FORBIDDEN).json({
          error: new Error("Access denied"),
        });
      }

      next();
    } catch (error) {
      return response.status(HttpStatus.FORBIDDEN).json({
        error: new Error("Access denied"),
      });
    }
  };
};