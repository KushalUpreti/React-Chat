const express = require('express');
const app = express();
const http = require('http').Server(app);
const mongoose = require('mongoose');
const userController = require('./controllers/user_controller');
const socketController = require('./controllers/socket_controller');
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
    },
});

const dotenv = require('dotenv');
const userRouter = require('./routes/user_routes');
const HttpError = require('./models/http-error');

dotenv.config();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

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

io.on("connection", (socket) => {
    const id = socket.handshake.query.id;
    socket.join(id);

    userController.activeStatus(id, socket, 'active', true);

    socket.on('send-message', ({ recipients, messageObject }) => {
        socketController.sendMessage({ recipients, messageObject }, id, socket)
    });

    socket.on('add-conversation', ({ recipients, conversationObj }) => {
        socketController.add_conversation({ recipients, conversationObj }, id, socket);
    });

    socket.on('typing', ({ recipients, conversation_id }) => {
        socketController.typing({ recipients, conversation_id }, id, socket);
    })

    socket.on('not-typing', ({ recipients, conversation_id }) => {
        socketController.not_typing({ recipients, conversation_id }, id, socket);
    })

    socket.on('remove-conversation', ({ recipients, conversation_id }) => {
        socketController.remove_conversation({ recipients, conversation_id }, id, socket);
    });

    socket.on('delete-message', ({ recipients, conversation_id, message_position }) => {
        socketController.remove_message({ recipients, conversation_id, message_position }, id, socket);
    })

    socket.on('disconnect', function disconnect() {
        userController.activeStatus(socket.handshake.query.id, socket, 'offline', false);
    });
});


mongoose.connect(`mongodb+srv://IcyHotShoto:${process.env.MONGO_DB_DATABASE_PASSWORD}@cluster0.dbftm.mongodb.net/chat?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        http.listen(process.env.PORT || 8080, () => {
            console.log('listening on :8080');
        });
    }).catch((err) => {
        console.log(err);
    })

module.exports = io;