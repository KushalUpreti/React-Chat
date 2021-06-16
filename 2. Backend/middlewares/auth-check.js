const HttpError = require("../models/http-error");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    let token;
    try {
        token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new HttpError(401, "Authentication error");
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userData = { userId: decodedToken.user_id };
        next();
    } catch (err) {
        console.log(err);
        return next(new HttpError(401, 'Authentication error. Token invalid'));
    }
}