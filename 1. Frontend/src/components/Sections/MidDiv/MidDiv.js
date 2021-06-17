import './MidDiv.css';
import { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { updateConversation } from '../../../Store/Reducers/conversationSlice';
import { useLocation, useHistory } from 'react-router-dom';
import { useHttpClient } from '../../../hooks/http-hook';
import { useSocketObject } from '../../../contexts/socket-context';
import { useDispatch, useSelector } from 'react-redux';
import { addMessageToConversation, selectMessage, addAllMessages } from '../../../Store/Reducers/messageSlice';
import AuthContext from '../../../contexts/auth-context';
import MessageHeader from '../../MessageHeader/MessageHeader';
import ConversationHolder from '../../ConversationHolder/CoversationHolder';
import SendMessage from '../../SendMessage/SendMessage';

function MidDiv() {
    const messageRedux = useSelector(selectMessage);
    const location = useLocation();
    const ref = useRef();
    const history = useHistory();
    const socket = useSocketObject();
    const auth = useContext(AuthContext);
    const dispatch = useDispatch();

    const { sendRequest } = useHttpClient();

    const { recipients, conversationId, id, initials } = location.userData;
    const recipient = location.userData.name;



    useEffect(() => {
        socket.on('receive-message', (incoming) => {
            if (incoming.message.conversation_id !== ref.current) {
                return;
            }
            dispatch(addMessageToConversation(incoming.message));
        });
    }, [socket])


    useEffect(() => {
        if (!recipient) {
            history.push("/");
        }
        ref.current = conversationId;
        getMessages(conversationId);
    }, [location.userData])

    async function getMessages(conversationId) {
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }
        const ans = await sendRequest(`http://localhost:8080/user/allMessages/${conversationId}`, "GET", config, null);
        // console.log(ans.data[0].username);
        dispatch(addAllMessages(ans.data));
    }

    const sendMessage = useCallback((e, message) => {
        e.preventDefault();

        if (message.trim().length === 0) { return; }
        let messageObject = {
            conversation_id: conversationId,
            message,
            username: auth.username,
            sent_by: auth.userId,
            sent_date: new Date()
        }
        socket.emit('send-message', { recipients, messageObject });

        dispatch(addMessageToConversation(messageObject));
        dispatch(updateConversation({ message: messageObject }));

        const payload = {
            message,
            conversation_id: ref.current,
            sent_by: auth.userId
        }
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }

        sendRequest("http://localhost:8080/user/addMessage", "POST", payload, config);

        const elem = document.querySelector('.dummy');
        elem.scrollIntoView({ behavior: 'smooth' });

    }, [socket]);


    return <div className="midDiv">
        <MessageHeader
            username={recipient}
            initials={initials}
            convId={conversationId}
            user_id={auth.userId}
            friendId={id} />
        <div className="conversation">
            <ConversationHolder messages={messageRedux} />
            <SendMessage send={sendMessage} />
        </div>

    </div>
}

export default MidDiv;