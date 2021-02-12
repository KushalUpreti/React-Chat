import './ConversationHolder.css';
import Message from './Message';
import AuthContext from '../contexts/auth-context';
import { useContext } from 'react';

function MessageContainer(props) {
    return <div className="messageContainer" style={props.justify}>
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

            return <MessageContainer key={item.sent_date + " " + item.message} justify={style}>
                <Message message={item.message} color={messageStyle} />
            </MessageContainer>
        }) : null}

    </div>
}

export default ConversationHolder;