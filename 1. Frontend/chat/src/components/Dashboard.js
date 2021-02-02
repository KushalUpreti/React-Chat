import { useContext, useState, useEffect } from "react";

import Header from '../shared/Header';
import Container from '../shared/Container';
import EdgeContainer from '../shared/EdgeContainer';
import UserInfo from '../shared/UserInfo';
import SearchBar from '../shared/SearchBar';
import ConversationCard from '../shared/ConversationCard';
import MidDiv from '../shared/MidDiv';

import { useHttpClient } from '../hooks/http-hook';
import AuthContext from '../contexts/auth-context';

function Dashboard() {
    const [conversation, setConversation] = useState([]);


    const auth = useContext(AuthContext);
    const { sendRequest } = useHttpClient();
    const username = auth.username;
    const userId = auth.userId;

    useEffect(() => {
        fetchConversation();
    }, [])

    async function fetchConversation() {
        const conversations = await sendRequest(`http://localhost:8080/user/getAllConversations/${userId}`, "GET", null, null);
        setConversation(conversations.data);
    }

    function prepareData(item) {
        let conversationName = item.conversation_name;
        conversationName = conversationName.replace(username, "");
        conversationName = conversationName.trim();

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
            return item !== userId;
        }).pop();



        return { conversationName, time, initials, path };
    }

    return <>
        <Header title="React Chat" caption="Wauu nice nice" />
        <Container>
            <EdgeContainer margin="12px 5px 12px 0">
                <UserInfo username={username} userId={userId} />
                <SearchBar />
                <h2 style={{
                    margin: "10px",
                    padding: "10px",
                    fontFamily: "'Merriweather Sans', sans-serif"
                }}>Chats</h2>

                <div style={{ overflowY: "scroll", height: "70%" }}>
                    {conversation.length > 0 ? conversation.map((item) => {
                        const { conversationName, initials, time, path } = prepareData(item)
                        return <ConversationCard key={item.date_created} initials={initials} recipient={conversationName} time={time} recipientId={path} />
                    }) : <p style={{ marginTop: "60%", padding: "15px" }}>No conversation made yet!!</p>}
                </div>
            </EdgeContainer>
            <MidDiv />
            <EdgeContainer margin="10px 12px 12px 5px">

            </EdgeContainer>
        </Container>

    </>;
}

export default Dashboard;