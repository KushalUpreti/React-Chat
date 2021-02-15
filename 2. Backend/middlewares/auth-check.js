const HttpError = require("../models/http-error");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    let token;
    try {
        console.log(req.headers);
        token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new HttpError(401, "Authentication failed");
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        err = new HttpError(401, 'Authentication failed');
        return next(err);
    }
}