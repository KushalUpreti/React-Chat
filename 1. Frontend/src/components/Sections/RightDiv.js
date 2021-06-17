import { useState, useContext, useEffect } from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import { useDispatch, useSelector } from 'react-redux';
import { useSocketObject } from '../../contexts/socket-context';
import AuthContext from '../../contexts/auth-context';
import EdgeContainer from '../EdgeContainer/EdgeContainer';
import Modal from '../UI/Modal/Modal';
import { addNewConversation } from '../../Store/Reducers/conversationSlice';
import { addAllActiveUsers, selectActive, addActiveUser, removeOfflineUser } from '../../Store/Reducers/activeUsersSlice';
import Actions from '../Actions/Actions';
import ActiveFriends from '../ActiveFriends/ActiveFriends';
import Suggested from '../Suggested/Suggested';
import AddFriendForm from '../AddFriendForm/AddFriendForm';
import Group from '../../pages/GroupComponent/Group';

function RightDiv(props) {
    const { sendRequest } = useHttpClient();
    const socket = useSocketObject();
    const auth = useContext(AuthContext);
    const dispatch = useDispatch();

    const [modalAddFriend, setModalAddName] = useState(false);
    const [modalCreateGroup, setModalCreateGroup] = useState(false);
    const [text, setText] = useState("");
    const activeRedux = useSelector(selectActive);

    useEffect(() => {
        if (socket !== undefined) {
            socket.on('active', (incoming) => {
                dispatch(addActiveUser(incoming));
            });

            socket.on('offline', (incoming) => {
                dispatch(removeOfflineUser(incoming));
            })
        }
    }, [socket])

    useEffect(() => {
        async function fetchActiveFriends() {
            let config = {
                headers: {
                    Authorization: 'Bearer ' + auth.token,
                    "Content-Type": "application/json",
                }
            }
            const activeFriends = await sendRequest(`http://localhost:8080/user/getAllActiveUsers/${auth.userId}`, "GET", config, null);
            dispatch(addAllActiveUsers(activeFriends.data));
        }
        fetchActiveFriends();
    }, []);


    const addFriendHandler = () => {
        setModalAddName(true);
    }

    const onTypeHandler = (e) => {
        setText(e.target.value);
    }

    const onAddFormSubmit = async (e) => {
        e.preventDefault();
        setModalAddName(false);
        if (!text) { return; }
        if (text === auth.userId) {
            console.log("Invalid Id");
            return;
        }
        const payload = {
            friendId: text,
        }
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }

        const newConversation = await sendRequest("http://localhost:8080/user/addOrRemoveFriend", "POST", payload, config);
        if (!newConversation.data) {
            return;
        }
        dispatch(addNewConversation(newConversation.data));

    }

    const createGroupHandler = () => {
        setModalCreateGroup(true);
    }


    return (
        <EdgeContainer margin="10px 12px 12px 5px">
            {modalAddFriend ? <Modal
                show={modalAddFriend}
                hide={() => { setModalAddName(false); }}
                style={{ height: "30%", top: "20vh" }}>

                <AddFriendForm
                    onAddFormSubmit={onAddFormSubmit}
                    onTypeHandler={onTypeHandler}
                    text={text} />
            </Modal> : null}


            {modalCreateGroup ? <Modal
                show={modalCreateGroup}
                hide={() => { setModalCreateGroup(false); }}
                style={{ height: "82%", top: "9vh" }}>
                <Group hide={() => { setModalCreateGroup(false); }} />
            </Modal> : null}

            <Actions action="Add Friend" class="fa fa-user-plus" style={{ margin: "15px 5px 0 5px" }} click={addFriendHandler} />
            <Actions action="Create Group" class="fa fa-users" style={{ margin: "10px 5px 0 5px" }} click={createGroupHandler} />
            <ActiveFriends active={activeRedux} />
            <Suggested />
        </EdgeContainer>
    )
}

export default RightDiv;