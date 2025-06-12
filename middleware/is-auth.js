const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new Error("Not authenticated.");
        error.statusCode = 401; // Unauthorized
        throw error;
    }

    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) {
        const error = new Error("Not authenticated.");
        error.statusCode = 401; // Unauthorized
        throw error;
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "secret");
    }   catch (err) {
        err.statusCode = 500; // Internal Server Error
        return next(err);
    }
    if (!decodedToken) {
        const error = new Error("Not authenticated.");
        error.statusCode = 401; // Unauthorized
        throw error;
    }
    req.userId = decodedToken.userId;
    next();     
};