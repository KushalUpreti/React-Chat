import './Message.css';

function Message(props) {
    return <div className="message" style={props.color} title={props.date}>
        {props.message}
    </div>
}

export default Message;