import './ConversationHolder.css';
import Message from '../Message/Message';
import AuthContext from '../../contexts/auth-context';
import { getMessageDate } from '../../sharedFunctions/sharedFunctions';
import Avatar from '../Avatar/Avatar';
import { useContext } from 'react';
import Spinner from '../UI/Spinner/Spinner';

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

    let content = <p style={{ margin: "auto", padding: "20px 0" }}>Say Hi to your new friend..</p>;
    if (props.messages.length > 0) {
        content = props.messages.map((item) => {
            let style = {
                justifyContent: 'flex-start',
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
        })
    } if (props.loading) {
        content = <Spinner outerStyle={{ top: "45%", left: "48%" }} style={{ width: "70px", height: "70px" }} />
    }

    return <div className="conversationHolder" >
        {props.loading ? null : <div className="fix"></div>}
        {content}
        <div className="dummy"></div>
    </div>
}

export default ConversationHolder;