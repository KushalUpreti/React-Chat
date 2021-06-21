
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
    console.log(conversation_id);
    const newRecipients = recipients.filter(r => r !== id);
    newRecipients.forEach(recipient => {
        socket.broadcast.to(recipient).emit('remove-conversation', conversation_id);
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


exports.sendMessage = sendMessage;
exports.add_conversation = add_conversation;
exports.remove_conversation = remove_conversation;
exports.typing = typing;
exports.not_typing = not_typing;