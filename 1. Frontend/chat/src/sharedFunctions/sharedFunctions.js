function getMessageDate(date) {
    let messageDate = new Date(date);
    let diff = Math.abs(new Date() - messageDate);
    let days = Math.floor((diff / (1000 * 60 * 60 * 24)));
    let time;

    if (days > 1) time = `${days} days ago`;
    else if (days === 1) time = `${days} day ago`;
    else {
        time = messageDate.getHours() + ":" + messageDate.getMinutes();
    }

    return time;
}

exports.getMessageDate = getMessageDate;