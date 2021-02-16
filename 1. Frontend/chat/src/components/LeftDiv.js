import { useContext, useState, useEffect, useCallback } from 'react';
import { useHttpClient } from '../hooks/http-hook';
import { useDispatch } from 'react-redux';
import { addNewConversation } from '../Store/Reducers/conversationSlice';
import EdgeContainer from './EdgeContainer';
import UserInfo from './UserInfo';
import SearchBar from './SearchBar';
import SearchContainer from './SearchContainer';
import AllConversations from './AllConversations';
import AuthContext from '../contexts/auth-context';

function LeftDiv() {
    const auth = useContext(AuthContext);
    const { sendRequest } = useHttpClient();
    const dispatch = useDispatch();

    const [query, setQuery] = useState({
        text: "",
        searching: false
    })

    const [searchResult, setSearchResult] = useState([]);

    const username = auth.username;
    const userId = auth.userId;

    const downloadSearchData = useCallback(async (text) => {
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
            }
        }
        const result = await sendRequest(`https://reactchat01.herokuapp.com/user/searchUsers/${text}`, "GET", null, config);
        const newArray = result.data.filter((item) => {
            return item._id !== auth.userId;
        })
        setSearchResult(newArray);

    }, [sendRequest])

    useEffect(() => {
        if (query.text.length === 0) { return }
        downloadSearchData(query.text);
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

    const addFriendHandler = async (friendId) => {
        if (friendId === userId) {
            return;
        }

        const payload = {
            id: userId,
            friendId,
            action: true
        }
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }

        const newConversation = await sendRequest("https://reactchat01.herokuapp.com/user/addOrRemoveFriend", "POST", payload, config);
        if (!newConversation) { return; }
        dispatch(addNewConversation(newConversation.data));

        setSearchResult(prevState => {
            const array = [...prevState];
            const newArray = array.filter((item) => {
                return item._id !== friendId;
            })
            return newArray;
        })
    }

    return (
        <EdgeContainer margin="12px 5px 12px 0">
            <UserInfo username={username} userId={userId} />
            <div>
                <SearchBar text={query.text} handler={searchHandler} />
                {query.searching ? <SearchContainer searches={searchResult} addFriend={addFriendHandler} /> : null}
            </div>

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