import { useState, useContext, useEffect } from 'react';
import { useHttpClient } from '../hooks/http-hook';
import { useDispatch, useSelector } from 'react-redux';
import { useSocketObject } from '../contexts/socket-context';
import AuthContext from '../contexts/auth-context';
import EdgeContainer from './EdgeContainer';
import Modal from './UI/Modal';
import { addNewConversation } from '../Store/Reducers/conversationSlice';
import { addAllActiveUsers, selectActive, addActiveUser, removeOfflineUser } from '../Store/Reducers/activeUsersSlice';
import Actions from './Actions';
import ActiveFriends from './ActiveFriends';
import Suggested from './Suggested';

function RightDiv(props) {
    const { sendRequest } = useHttpClient();
    const socket = useSocketObject();
    const auth = useContext(AuthContext);
    const dispatch = useDispatch();

    const [modal, setModal] = useState(false);
    const [text, setText] = useState("");
    const activeRedux = useSelector(selectActive);

    useEffect(() => {
        if (socket !== undefined) {
            socket.on('active', (incoming) => {
                console.log("Active");
                dispatch(addActiveUser(incoming));
            });

            socket.on('offline', (incoming) => {
                console.log("off");
                dispatch(removeOfflineUser(incoming));
            })
        }
    }, [socket])

    useEffect(() => {


        async function fetchActiveFriends() {
            const activeFriends = await sendRequest(`http://localhost:8080/user/getAllActiveUsers/${auth.userId}`, "GET", null, null);
            dispatch(addAllActiveUsers(activeFriends.data));
        }
        fetchActiveFriends();
    }, []);


    const addFriendHandler = () => {
        setModal(true);
    }

    const onTypeHandler = (e) => {
        setText(e.target.value);
    }

    const onAddFormSubmit = async (e) => {
        e.preventDefault();
        closeModalHandler();
        if (!text) { return; }
        if (text === auth.userId) {
            console.log("Invalid Id");
            return;
        }
        const payload = {
            id: auth.userId,
            friendId: text,
            action: true
        }
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }

        const newConversation = await sendRequest("http://localhost:8080/user/addOrRemoveFriend", "POST", payload, config);
        dispatch(addNewConversation(newConversation.data));

    }

    const createGroupHandler = () => {

    }

    const closeModalHandler = () => {
        setModal(false);
    }


    return (
        <EdgeContainer margin="10px 12px 12px 5px">
            {modal ? <Modal show={modal} hide={closeModalHandler} submit={onAddFormSubmit} type={onTypeHandler} textValue={text} /> : null}

            <Actions action="Add Friend" class="fa fa-user-plus" style={{ margin: "15px 5px 0 5px" }} click={addFriendHandler} />
            <Actions action="Create Group" class="fa fa-users" style={{ margin: "10px 5px 0 5px" }} click={createGroupHandler} />
            <ActiveFriends active={activeRedux} />
            <Suggested />
        </EdgeContainer>
    )
}

export default RightDiv;