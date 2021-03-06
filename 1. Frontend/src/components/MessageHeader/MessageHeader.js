import { useContext, useState } from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import { useDispatch } from 'react-redux';
import { removeAllMessages } from '../../Store/Reducers/messageSlice';
import { removeConversation } from '../../Store/Reducers/conversationSlice';
import { removeOfflineUser } from '../../Store/Reducers/activeUsersSlice';
import './MessageHeader.css';
import Avatar from '../Avatar/Avatar';
import SearchContainer from '../SearchContainer/SearchContainer';
import Actions from '../Actions/Actions';
import AuthContext from '../../contexts/auth-context';
import { useHistory } from 'react-router';
import { useSocketObject } from '../../contexts/socket-context';

function MessageHeader(props) {
    const [menu, setMenu] = useState(false);
    const { sendRequest } = useHttpClient();
    const dispatch = useDispatch();
    const auth = useContext(AuthContext);
    const history = useHistory();
    const socket = useSocketObject();

    const menuHandler = () => {
        setMenu(prevState => {
            return !prevState;
        })
    }

    const deleteMessage = async () => {
        const payload = {
            conversation_id: props.convId
        }
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }
        await sendRequest("http://localhost:8080/user/deleteAllMessages", "POST", payload, config);
        dispatch(removeAllMessages(null));
    }

    const unfriendUser = async () => {
        const payload = {
            conversation_id: props.convId,
            friendId: props.recipients.filter(item => item !== auth.userId)[0]
        }
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }
        let result;
        try {
            result = await sendRequest("http://localhost:8080/user/unfriendUser", "POST", payload, config);
        } catch (error) {
            console.log(error);
        }
        if (!result) return

        socket.emit('offline-user', { recipients: props.recipients });
        socket.emit('remove-conversation', { recipients: props.recipients, conversation_id: props.convId })
        dispatch(removeConversation(props.convId));
        dispatch(removeOfflineUser({ id: props.recipients.filter(r => r !== auth.userId)[0] }));
        history.push('/');
    }

    const deleteGroup = async () => {
        const payload = {
            conversation_id: props.convId,
        }

        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }
        let result;
        try {
            result = await sendRequest("http://localhost:8080/user/deleteGroup", "POST", payload, config);
        } catch (error) {
            console.log(error);
        }
        if (!result) return
        dispatch(removeConversation(props.convId));
        socket.emit('remove-conversation', { recipients: props.recipients, conversation_id: props.convId });
        history.push('/');
    }

    const leaveGroup = async () => {
        const payload = {
            conversation_id: props.convId,
        }

        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }
        let result;
        try {
            result = await sendRequest("http://localhost:8080/user/leaveGroup", "POST", payload, config);
        } catch (error) {
            console.log(error);
        }
        if (!result) return;
        dispatch(removeConversation(props.convId));
        history.push('/');
    }


    const style = {
        marginBottom: "20px",
        marginTop: "15px",
        fontSize: "18px",
    }
    return <>
        <div className="messageHeader">
            <div className="recieverInfo">
                <Avatar initials={props.initials} />
                <div className="userTextInfo">
                    <h4>{props.username}</h4>
                    <h5>Last active 5 min ago</h5>
                </div>
            </div>
            <div className="menuContainer" onClick={menuHandler}>
                <div className="menu" ></div>
            </div>
            {menu ? <SearchContainer searches={[]} style={{ right: "30px", top: "25px", height: "130px" }}>
                {props.type !== "Group" ?
                    <>
                        <Actions action="Delete all messages" class="fas fa-trash-alt" style={style} click={deleteMessage} />
                        <Actions action="Unfriend user" class="fas fa-user-slash" style={style} click={unfriendUser} />
                    </> : <>
                        {auth.userId === props.admin ?
                            <Actions action="Delete Group" class="fas fa-trash-alt" style={style} click={deleteGroup} /> : null}
                        <Actions action="Leave Group" class="fas fa-rocket" style={style} click={leaveGroup} />
                    </>
                }
                <p style={{ color: "red", fontSize: "13px", padding: "0 5px" }}>Warning! No confirmation option will appear</p>
            </SearchContainer> : null}
        </div>
    </>
}

export default MessageHeader;