import './Group.css';
import { useCallback, useContext, useEffect, useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import Button from '../../components/UI/Button/Button';
import AuthContext from '../../contexts/auth-context';
import { useHttpClient } from '../../hooks/http-hook';
import { useDispatch } from 'react-redux';
import { addNewConversation } from '../../Store/Reducers/conversationSlice';

function FriendItem(props) {
    return <div class="friendItem">
        <p>{props.username}</p>
        <input type="checkbox" onChange={props.checkHandler} checked={props.checked || false} />
    </div>
}

export default function Group(props) {
    const [groupName, setGroupName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [checkedFriends, setCheckedFriends] = useState([]);

    const auth = useContext(AuthContext);
    const dispatch = useDispatch();
    const { sendRequest } = useHttpClient();

    useEffect(() => {
        getAllFriends();
    }, [])

    const groupNameHandler = (e) => {
        setGroupName(e.target.value);
    }

    const searchHandler = (e) => {
        setSearch(e.target.value);
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

    const downloadSearchData = useCallback(async (text) => {
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }
        // const result = await sendRequest(`http://localhost:8080/user/searchUsers/${text}`, "GET", config, null);
        // const newArray = result.data.filter((item) => {
        //     return item._id !== auth.userId;
        // })
        // setSearchResult(newArray);

    }, [sendRequest])

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

    const removeCommonElement = (data) => {
        let newArray = [...data];

        newArray.forEach((element, index) => {
            checkedFriends.forEach(checked => {
                if (element.id === checked.id) {
                    newArray.splice(index, 1);
                }
            });
        });
        return newArray;
    }

    const createGroup = async () => {
        if (groupName.trim().length === 0 || checkedFriends.length === 0) {
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
        props.hide();
    }

    useEffect(() => {
        if (search.length === 0) {
            getAllFriends();
            return;
        }
        downloadSearchData(search);
    }, [search, downloadSearchData])


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
            text={search}
            handler={searchHandler}
            disabled
        />

        <div className="friendPara">
            <p >Friends</p>
        </div>

        <section class="friendList">
            {search.length === 0 ? checkedFriends.map((item) => {
                return <FriendItem
                    username={item.username}
                    key={item._id}
                    checkHandler={(e) => { checkedHandler(e, item) }
                    }
                    checked
                />
            }) : null}

            {searchResult.map((item) => {
                let valid = true;
                checkedFriends.forEach(checked => {
                    if (item.id === checked.id || item._id === checked.id) {
                        valid = false;
                    }
                });
                if (valid) {
                    return <FriendItem
                        username={item.username}
                        key={item._id}
                        checkHandler={(e) => { checkedHandler(e, item) }

                        }
                    />
                } else { return null; }
            })}
        </section>
        <div className="buttonContainer">
            <Button type="submit" text="Create" clickHandler={createGroup} />
        </div>
    </div>
}