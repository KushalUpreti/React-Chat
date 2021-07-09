import './ConversationHolder.css';
import Message from '../Message/Message';
import AuthContext from '../../contexts/auth-context';
import { getMessageDate } from '../../sharedFunctions/sharedFunctions';
import { removeSingleMessge } from '../../Store/Reducers/messageSlice';
import Avatar from '../Avatar/Avatar';
import { useContext, useState } from 'react';
import Spinner from '../UI/Spinner/Spinner';
import Typing from '../UI/Typing/Typing';
import Actions from '../Actions/Actions';
import { useDispatch } from 'react-redux';
import { useSocketObject } from '../../contexts/socket-context';
import { useHttpClient } from '../../hooks/http-hook';

function ConversationHolder(props) {
    const dispatch = useDispatch();
    const auth = useContext(AuthContext);
    const socket = useSocketObject();
    const { sendRequest } = useHttpClient();

    const deleteMessageHandler = async (message_position, message_id) => {
        dispatch(removeSingleMessge(message_position));
        socket.emit('delete-message', { recipients: props.recipients, conversation_id: props.conversation_id, message_position });
        const payload = {
            message_id
        }
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }
        let result = await sendRequest("http://localhost:8080/user/deleteOneMessage", "POST", payload, config);
        if (!result) {
            alert("Error deleting message");
        };

    }

    let content = <p style={{ margin: "auto", padding: "20px 0" }}>Say Hi to your new friend..</p>;
    if (props.messages.length > 0) {
        content = <>
            {props.oldLoading ? <Spinner outerStyle={{ top: "5%", left: "48%" }} style={{ width: "60px", height: "60px" }} /> : null}
            {props.messages.map((item, index) => {
                let style = {
                    justifyContent: 'flex-start',
                }
                let messageStyle = {
                    backgroundColor: !item.deleted ? 'rgb(255 0 40)' : 'rgb(88, 88, 88)'
                }
                if (item.sent_by === auth.userId) {
                    style = {
                        justifyContent: 'flex-end',
                    }
                    messageStyle = {
                        backgroundColor: !item.deleted ? 'rgb(0, 132, 255)' : 'rgb(88, 88, 88)'
                    }
                }
                const date = "Sent time: " + getMessageDate(item.sent_date);
                return <MessageContainer
                    key={item.sent_date + " " + item.message}
                    justify={style}
                    displayAvatar={item.sent_by !== auth.userId}
                    avatarInitials={item.username[0]}
                    position={index}
                    delete={deleteMessageHandler}
                    deleted={item.deleted}
                    conversation_id={props.conversation_id}
                    _id={item._id}
                >

                    <Message
                        username={item.username.slice(0, item.username.indexOf(" "))}
                        message={item.message}
                        color={messageStyle} date={date}
                        displayName={item.sent_by !== auth.userId}
                    />
                </MessageContainer>
            })}
        </>


    } if (props.loading) {
        content = <Spinner outerStyle={{ top: "45%", left: "48%" }} style={{ width: "60px", height: "60px" }} />
    }

    return <div className="conversationHolder" >
        {props.loading ? null : <div className="fix"></div>}
        {content}
        {props.typing ? <Typing /> : null}
        <div className="dummy"></div>
    </div>
}

function MessageContainer(props) {
    const [deleteMessage, setDelete] = useState(false);
    const style = {
        fontSize: "18px",
    }

    const deleteHandler = () => {
        setDelete(prevState => {
            return !prevState;
        })
    }

    return <div className="messageContainer" style={props.justify} onMouseEnter={deleteHandler} onMouseLeave={deleteHandler}>
        {!props.displayAvatar && deleteMessage && !props.deleted ? <Actions
            action=""
            class="fas fa-trash-alt"
            style={style}
            click={() => {
                props.delete(props.position, props._id);
            }} /> : null}
        {props.displayAvatar ? <Avatar
            style={{ height: "30px", width: "30px", color: "white", fontSize: "0.93rem", marginTop: "20px" }}
            initials={props.avatarInitials}></Avatar> : null}
        {props.children}
    </div>
}

export default ConversationHolder;