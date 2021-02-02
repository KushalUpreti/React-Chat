import './MessageHeader.css';
import Avatar from './Avatar';

function MessageHeader(props) {
    return <>
        <div className="messageHeader">
            <div className="recieverInfo">
                <Avatar initials={"P"} />
                <div className="userTextInfo">
                    <h4>{props.username}</h4>
                    <h5>Last active 5 min ago</h5>
                </div>
            </div>
        </div>
    </>
}

export default MessageHeader;