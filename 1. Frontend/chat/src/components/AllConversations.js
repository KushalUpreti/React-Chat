import { useEffect } from 'react';
import { useHttpClient } from '../hooks/http-hook';
import { useSocketObject } from '../contexts/socket-context';
import { useSelector, useDispatch } from 'react-redux';
import { loadConversation, updateConversation, selectConvo } from '../Store/Reducers/conversationSlice';
import { getMessageDate } from '../sharedFunctions/sharedFunctions';
import Spinner from './UI/Spinner';
import ConversationCard from './ConversationCard';

function AllConvesations(props) {
    const conversationRedux = useSelector(selectConvo);
    const dispatch = useDispatch();

    const { sendRequest, isLoading } = useHttpClient();

    const socket = useSocketObject();

    useEffect(() => {
        if (socket !== undefined) {
            socket.on('receive-message', (incoming) => {
                dispatch(updateConversation(incoming));
            })
        }

    }, [socket])


    useEffect(() => {
        fetchConversation();
    }, [])

    async function fetchConversation() {
        const conversations = await sendRequest(`http://localhost:8080/user/getAllConversations/${props.userId}`, "GET", null, null);
        dispatch(loadConversation(conversations.data));
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

        let time = getMessageDate(item.latest_message_date)
        const initials = conversationName.charAt(0);
        const values = [];

        item.users.forEach(element => {
            values.push(...Object.values(element));

        });

        const path = values.filter((item) => {
            return item !== props.userId;
        }).pop();

        let latest_message = item.latest_message;
        if (latest_message === null) {
            latest_message = "Say hi to your new friend";
        }

        return { conversationName, time, initials, path, recipient, conversationId, values, latest_message };
    }

    let content = null;
    let counter = 0;

    if (!isLoading & conversationRedux.length > 0) {
        content = conversationRedux.map((item) => {
            const { conversationName, initials, time, path, recipient, conversationId, values, latest_message } = prepareData(item)
            return <ConversationCard key={item.date_created + " " + ++counter} initials={initials} recipient={conversationName}
                time={time} username={recipient} recipientId={path} convId={conversationId} recipients={values} latest_message={latest_message} />
        });
    }
    else if (!isLoading & conversationRedux.length === 0) {
        content = <p style={{ marginTop: "60%", padding: "15px" }}>No conversation made yet!!</p>;
    } else {
        content = <Spinner boxStyle={{ marginTop: "40vh", width: "50px", height: "50px" }} borderStyle={{ width: "25px", height: "25px" }} />
    }


    return <div style={{ overflowY: "scroll", height: "70%" }}>
        {content}
    </div>
}

export default AllConvesations;