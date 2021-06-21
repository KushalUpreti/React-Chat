import './Message.css';

function Message(props) {
    return <>
        <div className="messageName">
            {props.displayName ? <p className="name">{props.username}</p> : null}
            <div className="message" style={props.color} title={props.date}>
                {props.message}
            </div>
        </div>
    </>
}

export default Message;