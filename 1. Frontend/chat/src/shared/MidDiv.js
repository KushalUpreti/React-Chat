import './MidDiv.css';
import { useEffect, useState, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useHttpClient } from '../hooks/http-hook';
import { useSocketObject } from '../contexts/socket-context';
import AuthContext from '../contexts/auth-context';


import MessageHeader from './MessageHeader';
import ConversationHolder from './CoversationHolder';
import SendMessage from './SendMessage';

function MidDiv() {
    const [messages, setMessages] = useState([]);

    const location = useLocation();
    const history = useHistory();
    const { sendRequest } = useHttpClient();
    const socket = useSocketObject();
    const auth = useContext(AuthContext);

    const recipient = location.userData.name;
    const recipients = location.userData.recipients;
    const conversationId = location.userData.conversationId;


    useEffect(() => {
        socket.on('receive-message', (incoming) => {

            const array = [...messages];
            array.push(incoming.message);
            console.log(array);
            // setMessages(array);
        })
    }, [socket])

    useEffect(() => {
        if (!recipient) {
            history.push("/");
        }
        getMessages(conversationId);
    }, [location.userData.id])

    async function getMessages(conversationId) {
        const ans = await sendRequest(`http://localhost:8080/user/allMessages/${conversationId}`, "GET", null, null);
        setMessages(ans.data);
    }

    function sendMessage(e, message) {
        e.preventDefault();
        let messageObject = {
            conversation_id: conversationId,
            message,
            sent_by: auth.userId,
            sent_date: new Date()
        }
        socket.emit('send-message', { recipients, messageObject });

    }


    return <div className="midDiv">
        <MessageHeader username={recipient} initials={location.userData.initials} />
        <div className="conversation">
            <ConversationHolder messages={messages} />
            <SendMessage send={sendMessage} />
        </div>
    </div>
}

export default MidDiv;