const express = require('express');
const app = express();
const http = require('http').Server(app);
const mongoose = require('mongoose');
const io = require('socket.io')(http);
const dotenv = require('dotenv');
const userRouter = require('./routes/user_routes');
const HttpError = require('./models/http-error');

dotenv.config();
app.use(express.json());

app.use("/user", userRouter);

app.use((req, res, next) => {
    throw new HttpError("Invalid Route", 404);
})

app.use((err, req, res, next) => {
    if (res.headerSent) {
        return next(err);
    }
    res.status(err.code || 500);
    res.json({ message: err.message || 'An unknown error occurred!' });

})


mongoose.connect(`mongodb+srv://IcyHotShoto:${process.env.MONGO_DB_DATABASE_PASSWORD}@cluster0.dbftm.mongodb.net/chat?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        http.listen(8080, () => {
            console.log('listening on :8080');
        });
    }).catch((err) => {
        console.log(err);
    })
