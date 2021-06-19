
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


exports.sendMessage = sendMessage;
exports.add_conversation = add_conversation;