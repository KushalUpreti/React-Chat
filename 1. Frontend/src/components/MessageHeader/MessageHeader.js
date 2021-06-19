import { useContext, useState } from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import { useDispatch } from 'react-redux';
import { removeAllMessages } from '../../Store/Reducers/messageSlice';
import { removeConversation } from '../../Store/Reducers/conversationSlice';
import './MessageHeader.css';
import Avatar from '../Avatar/Avatar';
import SearchContainer from '../SearchContainer/SearchContainer';
import Actions from '../Actions/Actions';
import AuthContext from '../../contexts/auth-context';
import { useHistory } from 'react-router';

function MessageHeader(props) {
    const [menu, setMenu] = useState(false);
    const { sendRequest } = useHttpClient();
    const dispatch = useDispatch();
    const auth = useContext(AuthContext);
    const history = useHistory();

    const menuHandler = () => {
        setMenu(prevState => {
            return !prevState;
        })
    }

    const deleteMessage = async () => {
        const payload = {
            conversation_id: props.convId,
            user_id: props.user_id,
            friendId: props.friendId
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
            user_id: props.user_id,
            friendId: props.friendId
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
            {menu ? <SearchContainer searches={[]} style={{ right: "30px", top: "25px", height: props.isGroup ? "130px" : "170px" }}>
                {!props.isGroup ?
                    <>
                        <Actions action="Delete all messages" class="fas fa-trash-alt" style={style} click={deleteMessage} />
                        <Actions action="Unfriend user" class="fas fa-user-slash" style={style} click={unfriendUser} />
                        <Actions action="Block user" class="fas fa-shield-alt" style={style} />
                    </> : <>
                        {auth.userId === props.admin ?
                            <Actions action="Delete Group" class="fas fa-trash-alt" style={style} click={deleteMessage} /> : null}
                        <Actions action="Leave Group" class="fas fa-rocket" style={style} click={deleteMessage} />
                    </>
                }
                <p style={{ color: "red", fontSize: "13px", padding: "0 5px" }}>Warning! No confirmation option will appear</p>
            </SearchContainer> : null}
        </div>
    </>
}

export default MessageHeader;