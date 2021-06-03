import { useState } from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import { useDispatch } from 'react-redux';
import { removeAllMessages } from '../../Store/Reducers/messageReducer';
import { removeConversation } from '../../Store/Reducers/conversationSlice';
import './MessageHeader.css';
import Avatar from '../Avatar/Avatar';
import SearchContainer from '../SearchContainer/SearchContainer';
import Actions from '../Actions/Actions';

function MessageHeader(props) {
    const [menu, setMenu] = useState(false);
    const { sendRequest } = useHttpClient();
    const dispatch = useDispatch();

    const menuHandler = () => {
        setMenu(prevState => {
            return !prevState;
        })
    }

    const deleteMessage = async () => {
        const payload = {
            conversation_id: props.convId,
            user_id: props.user_id
        }
        let config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        await sendRequest("http://localhost:8080/user/deleteAllMessages", "POST", payload, config);
        dispatch(removeAllMessages(null));
    }

    const deleteConversation = async () => {
        const payload = {
            conversation_id: props.convId,
            user_id: props.user_id
        }
        let config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        await sendRequest("http://localhost:8080/user/deleteConversation", "POST", payload, config);
        dispatch(removeConversation(props.convId));
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
            {menu ? <SearchContainer searches={[]} style={{ right: "30px", top: "25px", height: "220px" }}>
                <Actions action="Delete all messages" class="fas fa-trash-alt" style={style} click={deleteMessage} />
                <Actions action="Delete this convo" class="fas fa-trash " style={style} click={deleteConversation} />
                <Actions action="Unfriend user" class="fas fa-user-slash" style={style} />
                <Actions action="Block user" class="fas fa-shield-alt" style={style} />
                <p style={{ color: "red", fontSize: "13px", padding: "0 5px" }}>Warning! No confirmation option will appear</p>
            </SearchContainer> : null}
        </div>
    </>
}

export default MessageHeader;