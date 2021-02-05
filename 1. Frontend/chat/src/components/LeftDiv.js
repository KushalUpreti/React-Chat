import { useContext } from 'react';
import EdgeContainer from './EdgeContainer';
import UserInfo from './UserInfo';
import SearchBar from './SearchBar';
import AllConversations from './AllConversations';
import AuthContext from '../contexts/auth-context';

function LeftDiv() {
    const auth = useContext(AuthContext);
    const username = auth.username;
    const userId = auth.userId;

    return (
        <EdgeContainer margin="12px 5px 12px 0">
            <UserInfo username={username} userId={userId} />
            <SearchBar />
            <h2 style={{
                margin: "15px 10px 5px 10px",
                padding: "10px",
                fontFamily: "'Merriweather Sans', sans-serif"
            }}>Chats</h2>

            <AllConversations username={username} userId={userId} />

        </EdgeContainer>
    )
}

export default LeftDiv;