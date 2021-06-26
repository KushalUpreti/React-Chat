import './MidDiv.css';
import { useEffect, useContext, useCallback, useRef, useState } from 'react';
import { updateConversation } from '../../../Store/Reducers/conversationSlice';
import { useLocation, useHistory } from 'react-router-dom';
import { useHttpClient } from '../../../hooks/http-hook';
import { useSocketObject } from '../../../contexts/socket-context';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { addMessageToConversation, selectMessage, addAllMessages, addMoreMessages, removeSingleMessge } from '../../../Store/Reducers/messageSlice';
import AuthContext from '../../../contexts/auth-context';
import MessageHeader from '../../MessageHeader/MessageHeader';
import ConversationHolder from '../../ConversationHolder/CoversationHolder';
import SendMessage from '../../SendMessage/SendMessage';
import axios from 'axios';

function MidDiv() {
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);

    const [message, setMessage] = useState("");

    const messageRedux = useSelector(selectMessage);
    const messageList = useStore().getState().message.messages;
    const location = useLocation();
    const ref = useRef();
    const history = useHistory();
    const socket = useSocketObject();
    const auth = useContext(AuthContext);
    const dispatch = useDispatch();

    const { sendRequest } = useHttpClient();

    const { recipients, conversation_id, initials, admin, type } = location.userData;
    const recipient = location.userData.name;

    useEffect(() => {
        socket.on('receive-message', (incoming) => {
            if (incoming.message.conversation_id !== ref.current) {
                return;
            }
            dispatch(addMessageToConversation(incoming.message));
            setTyping(false);
        });

        socket.on('recieve-typing', (incoming) => {
            if (incoming !== ref.current) {
                return;
            }
            if (!typing) {
                setTyping(true);
            }

        });

        socket.on('recieve-not-typing', (incoming) => {
            if (incoming !== ref.current) {
                return;
            }
            setTyping(false);
        });

        socket.on('remove-message', (incoming) => {
            if (incoming.conversation_id !== ref.current) { return; }
            dispatch(removeSingleMessge(incoming.message_position));
        }, [])

    }, [socket])

    useEffect(() => {
        function listener(event) {
            var element = event.target;
            if (element.scrollTop === 0) {
                // loadMoreMessage();
            }
        }
        let container = document.querySelector(".conversationHolder");
        container.addEventListener('scroll', listener);
        return () => {
            container.removeEventListener('scroll', listener);
        }
    }, [])


    useEffect(() => {
        if (!recipient) {
            history.push("/");
        }
        ref.current = conversation_id;
        getMessages(conversation_id);
    }, [location.userData])

    async function getMessages(conversation_id) {
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }
        setLoading(true);
        axios.get(`https://reactchat01.herokuapp.com/user/allMessages/${conversation_id}`, config).then(res => {
            dispatch(addAllMessages(res.data));
        }).finally(() => {
            setLoading(false);
            let container = document.querySelector(".conversationHolder");
            container.scrollTop = container.scrollHeight;
        });
    }

    async function loadMoreMessage() {
        console.log(messageList);
        if (!messageList[0]) { return; }
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }
        let res = await sendRequest(
            `https://reactchat01.herokuapp.com/user/loadMoreMessages?conversation_id=${ref.current}&oldest_date=${messageList[0].sent_date}`,
            "GET", config);
        dispatch(addMoreMessages(res.data));
    }

    function inputHandler(e) {
        setMessage(e.target.value);
        if (e.target.value.length > 0) {
            socket.emit('typing', { recipients, conversation_id: ref.current });
        } else {
            socket.emit('not-typing', { recipients, conversation_id: ref.current });
        }
    }
    function blur() {
        socket.emit('not-typing', { recipients, conversation_id: ref.current });
    }

    const sendMessage = useCallback(async (e, message) => {
        e.preventDefault();
        if (message.trim().length === 0) { return; }
        let messageObject = {
            conversation_id: ref.current,
            message,
            username: auth.username,
            sent_by: auth.userId,
            sent_date: new Date(),
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

        await sendRequest("https://reactchat01.herokuapp.com/user/addMessage", "POST", payload, config);
        let container = document.querySelector(".conversationHolder");
        container.scrollTop = container.scrollHeight;
    }, [socket]);


    return <div className="midDiv">
        <MessageHeader
            username={recipient}
            initials={initials}
            convId={ref.current}
            recipients={recipients}
            admin={admin}
            type={type}
        />
        <div className="conversation">
            <ConversationHolder
                messages={messageRedux}
                loading={loading}
                typing={typing}
                conversation_id={ref.current}
                recipients={recipients} />
            <SendMessage send={sendMessage} inputHandler={inputHandler} message={message} setMessage={setMessage} blur={blur} />
        </div>

    </div>
}

export default MidDiv;