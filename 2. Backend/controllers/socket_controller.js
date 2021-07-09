
const sendMessage = ({ recipients, messageObject }, id, socket) => {
    const newRecipients = recipients.filter(r => r !== id);
    newRecipients.forEach(recipient => {
        socket.broadcast.to(recipient).emit('receive-message', {
            sender: id, message: messageObject
        })
    })
}

const add_conversation = ({ recipients, conversationObj }, id, socket) => {
    const newRecipients = recipients.filter(r => r !== id);
    newRecipients.forEach(recipient => {
        socket.broadcast.to(recipient).emit('recieve-conversation', conversationObj);
    })
}

const remove_conversation = ({ recipients, conversation_id }, id, socket) => {
    const newRecipients = recipients.filter(r => r !== id);
    newRecipients.forEach(recipient => {
        socket.broadcast.to(recipient).emit('remove-conversation', conversation_id);
    })
}

const remove_message = ({ recipients, conversation_id, message_position }, id, socket) => {
    const newRecipients = recipients.filter(r => r !== id);
    newRecipients.forEach(recipient => {
        socket.broadcast.to(recipient).emit('remove-message', { conversation_id, message_position });
    })
}

const typing = ({ recipients, conversation_id }, id, socket) => {
    const newRecipients = recipients.filter(r => r !== id);
    newRecipients.forEach(recipient => {
        socket.broadcast.to(recipient).emit('recieve-typing', conversation_id);
    })
}

const not_typing = ({ recipients, conversation_id }, id, socket) => {
    const newRecipients = recipients.filter(r => r !== id);
    newRecipients.forEach(recipient => {
        socket.broadcast.to(recipient).emit('recieve-not-typing', conversation_id);
    })
}

const offline_user = ({ recipients }, id, socket) => {
    const newRecipients = recipients.filter(r => r !== id);

    newRecipients.forEach((recipient) => {
        socket.broadcast.to(recipient).emit('offline', { id });
    });
}


exports.sendMessage = sendMessage;
exports.add_conversation = add_conversation;
exports.remove_conversation = remove_conversation;
exports.remove_message = remove_message;
exports.typing = typing;
exports.not_typing = not_typing;
exports.offline_user = offline_user;