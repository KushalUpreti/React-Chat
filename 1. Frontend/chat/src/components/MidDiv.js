import './MidDiv.css';
import { useEffect, useState, useContext, useCallback, createRef } from 'react';
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
    const socket = useSocketObject();
    const divRef = createRef();
    const auth = useContext(AuthContext);

    const { sendRequest } = useHttpClient();

    const recipient = location.userData.name;
    const recipients = location.userData.recipients;
    const conversationId = location.userData.conversationId;


    useEffect(() => {
        socket.on('receive-message', (incoming) => {
            setMessages((prevState) => {
                const array = [...prevState];
                array.push(incoming.message);
                return array;
            })
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


    const sendMessage = useCallback((e, message) => {
        e.preventDefault();
        let messageObject = {
            conversation_id: conversationId,
            message,
            sent_by: auth.userId,
            sent_date: new Date()
        }
        socket.emit('send-message', { recipients, messageObject });
        setMessages((prevState) => {
            const array = [...prevState];
            array.push(messageObject);
            return array;
        })

        const messages = document.querySelector('.conversationHolder');
        console.log(messages);
        messages.scrollTop = messages.scrollHeight;

    }, [socket]);


    return <div className="midDiv">
        <MessageHeader username={recipient} initials={location.userData.initials} />
        <div className="conversation">
            <ConversationHolder messages={messages} refObj={divRef} />
            <SendMessage send={sendMessage} />
        </div>
    </div>
}

export default MidDiv;