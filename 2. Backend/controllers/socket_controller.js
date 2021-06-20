
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

const typing = ({ recipients, conversationId }, id, socket) => {
    const newRecipients = recipients.filter(r => r !== id);
    newRecipients.forEach(recipient => {
        socket.broadcast.to(recipient).emit('recieve-typing', conversationId);
    })
}

const not_typing = ({ recipients, conversationId }, id, socket) => {
    const newRecipients = recipients.filter(r => r !== id);
    newRecipients.forEach(recipient => {
        socket.broadcast.to(recipient).emit('recieve-not-typing', conversationId);
    })
}


exports.sendMessage = sendMessage;
exports.add_conversation = add_conversation;
exports.typing = typing;
exports.not_typing = not_typing;