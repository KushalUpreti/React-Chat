import './ConversationCard.css';
import { NavLink } from 'react-router-dom';
import Avatar from './Avatar';

function ConversationCard(props) {
    let path = `/messages`
    return (
        <NavLink style={{ textDecoration: 'none', color: "black" }} to={{
            pathname: path,
            search: `?recipient=${props.recipientId}`,
            userData: { name: props.username, initials: props.initials, id: props.recipientId, conversationId: props.convId, recipients: props.recipients }
        }} >
            <div className="conversationCard">
                <Avatar initials={props.initials} />
                <div className="userTextInfo">
                    <div className="convTextUpper">
                        <h4>{props.recipient}</h4>
                        <p>{props.time}</p>
                    </div>
                    <h5>la thik cha</h5>
                </div>
            </div>
        </NavLink>

    )
}

export default ConversationCard;