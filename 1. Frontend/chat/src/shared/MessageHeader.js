import './MessageHeader.css';
import Avatar from './Avatar';
import { useEffect } from 'react';

function MessageHeader(props) {
    useEffect(() => {
        console.log("user");
    }, [])

    return <>
        <div className="messageHeader">
            <div className="recieverInfo">
                <Avatar initials={props.initials} />
                <div className="userTextInfo">
                    <h4>{props.username}</h4>
                    <h5>Last active 5 min ago</h5>
                </div>
            </div>
        </div>
    </>
}

export default MessageHeader;