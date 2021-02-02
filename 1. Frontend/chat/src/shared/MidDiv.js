import './MidDiv.css';
import { useState, useEffect } from 'react';
import { useHttpClient } from '../hooks/http-hook';
import { withRouter } from 'react-router';

import MessageHeader from './MessageHeader';
import ConversationHolder from './CoversationHolder';
import SendMessage from './SendMessage';

function MidDiv(props) {

    const [username, setUsername] = useState("");
    const [initials, setInitials] = useState("");
    const { sendRequest } = useHttpClient();

    useEffect(() => {
        fetchUserInfo();
    }, [])

    async function fetchUserInfo() {
        const params = new URLSearchParams(props.location.search);
        let recipient = params.get("recipient");
        const username = await sendRequest(`http://localhost:8080/user/userInfo/${recipient}`);
        setUsername(username.data.username);
        setInitials(username.data.username.charAt(0));
    }

    return <div className="midDiv">
        <MessageHeader username={username} initials={initials} />
        <div className="conversation">
            <ConversationHolder />
            <SendMessage />
        </div>
    </div>
}

export default withRouter(MidDiv);