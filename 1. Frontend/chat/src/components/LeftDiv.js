import { useContext, useState, useEffect, useCallback } from 'react';
import { useHttpClient } from '../hooks/http-hook';
import EdgeContainer from './EdgeContainer';
import UserInfo from './UserInfo';
import SearchBar from './SearchBar';
import AllConversations from './AllConversations';
import AuthContext from '../contexts/auth-context';

function LeftDiv() {
    const auth = useContext(AuthContext);
    const { sendRequest } = useHttpClient();
    const [query, setQuery] = useState({
        text: "",
        searching: false
    })

    const [searchResult, setSearchResult] = useState([]);

    const username = auth.username;
    const userId = auth.userId;

    const downloadSearchData = useCallback(async (text) => {
        const result = await sendRequest(`http://localhost:8080/user/searchUsers/${text}`, "GET", null, null);
        setSearchResult(result.data);

    }, [sendRequest])

    useEffect(() => {
        if (query.text.length === 0) { return }
        downloadSearchData(query.text);
        console.log("Rerender check");
    }, [query, downloadSearchData])



    const searchHandler = (query) => {
        if (query.target.value.length === 0) {
            setQuery({
                text: "",
                searching: false
            })
            return;
        }

        setQuery({
            text: query.target.value,
            searching: true
        })
    }

    return (
        <EdgeContainer margin="12px 5px 12px 0">
            <UserInfo username={username} userId={userId} />
            <SearchBar text={query.text} handler={searchHandler} />
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