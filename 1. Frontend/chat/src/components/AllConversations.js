import { useState, useEffect } from 'react';
import { useHttpClient } from '../hooks/http-hook';
import { useSocketObject } from '../contexts/socket-context';
import ConversationCard from './ConversationCard';

function AllConvesations(props) {
    const [conversation, setConversation] = useState([]);
    const { sendRequest } = useHttpClient();

    const socket = useSocketObject();
    console.log(socket);

    useEffect(() => {
        // socket.on('receive-message', (incoming) => {
        //     console.log("change conversation");
        // })
    }, [socket])

    useEffect(() => {
        fetchConversation();
    }, [])

    async function fetchConversation() {
        const conversations = await sendRequest(`http://localhost:8080/user/getAllConversations/${props.userId}`, "GET", null, null);
        setConversation(conversations.data);
    }

    function prepareData(item) {
        let conversationId = item._id;
        let conversationName = item.conversation_name;
        conversationName = conversationName.replace(props.username, "");
        let recipient = conversationName;
        conversationName = conversationName.trim();
        conversationName = conversationName.slice(0, conversationName.indexOf(" "));
        if (conversationName.length >= 14) {
            conversationName = conversationName.slice(0, 12) + "..";
        }

        let messageDate = new Date(item.latest_message_date);

        let diff = Math.abs(new Date() - messageDate);
        let days = Math.floor((diff / (1000 * 60 * 60 * 24)));
        let time;

        if (days > 1) time = `${days} days ago`;
        else if (days === 1) time = `${days} day ago`;
        else time = "Today";

        const initials = conversationName.charAt(0);
        const values = [];

        item.users.forEach(element => {
            values.push(...Object.values(element));

        });

        const path = values.filter((item) => {
            return item !== props.userId;
        }).pop();

        return { conversationName, time, initials, path, recipient, conversationId, values };
    }

    return <div style={{ overflowY: "scroll", height: "70%" }}>
        {conversation.length > 0 ? conversation.map((item) => {
            const { conversationName, initials, time, path, recipient, conversationId, values } = prepareData(item)
            return <ConversationCard key={item.date_created} initials={initials} recipient={conversationName}
                time={time} username={recipient} recipientId={path} convId={conversationId} recipients={values} />
        }) : <p style={{ marginTop: "60%", padding: "15px" }}>No conversation made yet!!</p>}
    </div>
}

export default AllConvesations;