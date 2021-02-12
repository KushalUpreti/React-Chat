import './MidDiv.css';
import { useEffect, useState, useContext, useCallback } from 'react';
import { updateConversation } from '../Store/Reducers/conversationSlice';
import { useLocation, useHistory } from 'react-router-dom';
import { useHttpClient } from '../hooks/http-hook';
import { useSocketObject } from '../contexts/socket-context';
import { useDispatch } from 'react-redux';
import AuthContext from '../contexts/auth-context';

import MessageHeader from './MessageHeader';
import ConversationHolder from './CoversationHolder';
import SendMessage from './SendMessage';

function MidDiv() {
    const [messages, setMessages] = useState([]);

    const location = useLocation();
    const history = useHistory();
    const socket = useSocketObject();
    const auth = useContext(AuthContext);
    const dispatch = useDispatch();
    const { sendRequest } = useHttpClient();

    const recipient = location.userData.name;
    const recipients = location.userData.recipients;
    const conversationId = location.userData.conversationId;


    useEffect(() => {
        socket.on('receive-message', (incoming) => {
            setMessages((prevState) => {
                let array = [];
                if (Object.keys(prevState).length !== 0) {
                    array = [...prevState];
                }

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
    }, [location.userData])

    async function getMessages(conversationId) {
        const ans = await sendRequest(`http://localhost:8080/user/allMessages/${conversationId}`, "GET", null, null);
        setMessages(ans.data);
    }

    const sendMessage = useCallback((e, message) => {
        e.preventDefault();
        const a = new URLSearchParams(location.search);
        console.log(a.get("conversation"));
        if (message.length === 0) { return; }
        let messageObject = {
            conversation_id: conversationId,
            message,
            sent_by: auth.userId,
            sent_date: new Date()
        }
        socket.emit('send-message', { recipients, messageObject });

        setMessages((prevState) => {
            let array = [];
            if (Object.keys(prevState).length !== 0) {
                array = [...prevState];
            }
            array.push(messageObject);
            return array;
        })

        dispatch(updateConversation({ message: messageObject }));
        // sendRequest()

        // const elem = document.querySelector('.conversationHolder');
        // var lastScrollTop = 0;
        // var timer = window.setInterval(function () {
        //     elem.scrollTop = elem.scrollHeight;
        //     lastScrollTop = elem.scrollTop
        // }, 50);

        // elem.addEventListener("scroll", function () {
        //     if (lastScrollTop < elem.scrollTop) {
        //         window.clearInterval(timer);
        //     }
        // }, false);

    }, [socket]);


    return <div className="midDiv">
        <MessageHeader username={recipient} initials={location.userData.initials} />
        <div className="conversation">
            <ConversationHolder messages={messages} />
            <SendMessage send={sendMessage} />
        </div>
    </div>
}

export default MidDiv;