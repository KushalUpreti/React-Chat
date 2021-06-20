
import './Group.css';
import { useContext, useEffect, useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import Button from '../../components/UI/Button/Button';
import AuthContext from '../../contexts/auth-context';
import { useHttpClient } from '../../hooks/http-hook';
import { useDispatch } from 'react-redux';
import { addNewConversation } from '../../Store/Reducers/conversationSlice';
import { useSocketObject } from '../../contexts/socket-context';
import Spinner from '../../components/UI/Spinner/Spinner';

function FriendItem(props) {
    return <div class="friendItem">
        <p>{props.username}</p>
        <input type="checkbox" onChange={props.checkHandler} checked={props.checked || false} />
    </div>
}

export default function Group(props) {
    const [groupName, setGroupName] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [checkedFriends, setCheckedFriends] = useState([]);

    const auth = useContext(AuthContext);
    const dispatch = useDispatch();
    const { sendRequest, isLoading } = useHttpClient();
    const socket = useSocketObject();

    useEffect(() => {
        getAllFriends();
    }, [])

    const groupNameHandler = (e) => {
        setGroupName(e.target.value);
    }

    const checkedHandler = (e, user) => {
        if (e.target.checked) {
            setCheckedFriends(prevState => {
                const newState = [...prevState, user];
                return newState;
            })
        } else {
            const newArray = checkedFriends.filter(item => {
                return item.id !== user.id;
            });
            setCheckedFriends(newArray);
        }
    }

    const getAllFriends = async () => {
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }
        const result = await sendRequest(`http://localhost:8080/user/getAllFriends`, "GET", config, config);
        if (!result) { return; }
        setSearchResult(result.data);
    }

    const createGroup = async () => {
        if (groupName.trim().length === 0 || checkedFriends.length < 2) {
            return;
        }
        let payload = {
            conversation_name: groupName,
            users: checkedFriends.map(item => { return item.id })
        }
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json"
            }
        }
        const result = await sendRequest(`http://localhost:8080/user/createGroup`, "POST", payload, config);
        if (!result) { return }
        dispatch(addNewConversation(result.data));
        socket.emit('add-conversation', {
            recipients: checkedFriends.map(item => { return item.id }),
            conversationObj: result.data
        });
        props.hide();
    }

    return <div class="createGroup">

        <div class="title">
            <h2>Create Group</h2>
            <hr />
        </div>

        <SearchBar
            formStyle={{ margin: "10px 0", padding: "5px 0" }}
            style={{ width: "100%" }}
            placeholder="Group name."
            text={groupName}
            handler={groupNameHandler} />

        <SearchBar
            formStyle={{ margin: "0", padding: "5px 0" }}
            style={{ width: "100%" }}
            placeholder="Search Friends. Coming soon."
            disabled
        />

        <div className="friendPara">
            <p>Friends</p>
        </div>

        <section class="friendList">
            {checkedFriends.map((item) => {
                return <FriendItem
                    username={item.username}
                    key={item._id}
                    checkHandler={(e) => { checkedHandler(e, item) }
                    }
                    checked
                />
            })}

            {!isLoading ? searchResult.map((item) => {
                if (checkedFriends.includes(item)) {
                    return null;
                }
                return <FriendItem
                    username={item.username}
                    key={item.username}
                    checkHandler={(e) => { checkedHandler(e, item) }
                    }
                />
            }) : <Spinner outerStyle={{ top: "25%", left: "0%" }} style={{ width: "60px", height: "60px" }} />}
        </section>
        <div className="buttonContainer">
            <Button type="submit" text="Create" clickHandler={createGroup} />
        </div>
    </div>
}