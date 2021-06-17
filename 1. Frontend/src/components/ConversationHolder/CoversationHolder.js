import './ConversationHolder.css';
import Message from '../Message/Message';
import AuthContext from '../../contexts/auth-context';
import { getMessageDate } from '../../sharedFunctions/sharedFunctions';
import Avatar from '../Avatar/Avatar';
import { useContext } from 'react';

function MessageContainer(props) {
    return <div className="messageContainer" style={props.justify}>
        {props.displayAvatar ? <Avatar
            style={{ height: "30px", width: "30px", color: "white", fontSize: "0.93rem", marginTop: "20px" }}
            initials={props.avatarInitials}></Avatar> : null}
        {props.children}
    </div>
}

function ConversationHolder(props) {
    const auth = useContext(AuthContext);

    return <div className="conversationHolder" >
        <div className="fix"></div>
        {props.messages.length > 0 ? props.messages.map((item) => {
            let style = {
                justifyContent: 'flex-start',
                // alignItems: 'center'
            }
            let messageStyle = {
                backgroundColor: 'rgb(255 0 40)'
            }
            if (item.sent_by === auth.userId) {
                style = {
                    justifyContent: 'flex-end',
                }
                messageStyle = {
                    backgroundColor: 'rgb(0, 132, 255)'
                }
            }
            const date = "Sent time: " + getMessageDate(item.sent_date);
            return <MessageContainer
                key={item.sent_date + " " + item.message}
                justify={style}
                displayAvatar={item.sent_by !== auth.userId}
                avatarInitials={item.username[0]}
            >

                <Message
                    username={item.username.slice(0, item.username.indexOf(" "))}
                    message={item.message}
                    color={messageStyle} date={date}
                    displayName={item.sent_by !== auth.userId}
                />
            </MessageContainer>
        }) : null}
        <div className="dummy"></div>
    </div>
}

export default ConversationHolder;