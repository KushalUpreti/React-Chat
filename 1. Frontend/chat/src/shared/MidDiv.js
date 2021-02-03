import './MidDiv.css';
import { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useHttpClient } from '../hooks/http-hook';

import MessageHeader from './MessageHeader';
import ConversationHolder from './CoversationHolder';
import SendMessage from './SendMessage';

function MidDiv(props) {
    const [messages, setMessages] = useState([]);

    const location = useLocation();
    const recipient = location.userData.name;
    const history = useHistory();
    const { sendRequest } = useHttpClient();

    useEffect(() => {
        if (!recipient) {
            history.push("/");
        }
        getMessages(location.userData.conversationId);
    }, [location.userData.id])

    async function getMessages(conversationId) {
        const ans = await sendRequest(`http://localhost:8080/user/allMessages/${conversationId}`, "GET", null, null);
        setMessages(ans.data);
        console.log(ans.data);
    }


    return <div className="midDiv">
        <MessageHeader username={recipient} initials={location.userData.initials} />
        <div className="conversation">
            <ConversationHolder messages={messages} />
            <SendMessage />
        </div>
    </div>
}

export default MidDiv;