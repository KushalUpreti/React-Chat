import './Message.css';

function Message(props) {
    return <div className="message" style={props.color}>
        {props.message}
    </div>
}

export default Message;