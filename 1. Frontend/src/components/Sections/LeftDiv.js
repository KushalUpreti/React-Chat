import { useContext, useState, useEffect, useCallback } from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import { useDispatch } from 'react-redux';
import { addNewConversation, removeConversation } from '../../Store/Reducers/conversationSlice';
import EdgeContainer from '../EdgeContainer/EdgeContainer';
import UserInfo from '../UserInfo/UserInfo';
import SearchBar from '../SearchBar/SearchBar';
import SearchContainer from '../SearchContainer/SearchContainer';
import AllConversations from '../AllConversations';
import AuthContext from '../../contexts/auth-context';
import { useSocketObject } from '../../contexts/socket-context';
import { useHistory } from 'react-router';


function LeftDiv() {
    const [query, setQuery] = useState({
        text: "",
        searching: false
    })

    const [searchResult, setSearchResult] = useState([]);

    const auth = useContext(AuthContext);
    const { sendRequest } = useHttpClient();
    const dispatch = useDispatch();
    const socket = useSocketObject();
    const history = useHistory();
    const username = auth.username;
    const userId = auth.userId;

    useEffect(() => {
        if (socket !== undefined) {
            socket.on('recieve-conversation', (incoming) => {
                dispatch(addNewConversation(incoming));
            });

            socket.on('remove-conversation', (incoming) => {
                dispatch(removeConversation(incoming));
                history.push('/');
            });
        }
    }, [socket])

    const downloadSearchData = useCallback(async (text) => {
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }
        const result = await sendRequest(`https://reactchat01.herokuapp.com/user/searchUsers/${text}`, "GET", config, null);
        const newArray = result.data.filter((item) => {
            return item._id !== auth.userId;
        })
        setSearchResult(newArray);

    }, [sendRequest])

    useEffect(() => {
        if (query.text.length === 0) {
            setSearchResult([]);
            return
        }
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
        socket.emit('add-conversation', { recipients: [friendId], conversationObj: newConversation.data });

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
                <SearchBar
                    value={query}
                    text={query.text}
                    handler={searchHandler}
                    placeholder="Search Users"
                    onSubmit={(e) => { e.preventDefault(); }} />
                {query.searching ? <SearchContainer searches={searchResult} addFriend={addFriendHandler} search={true} /> : null}
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