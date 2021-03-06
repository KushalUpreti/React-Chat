import './ConversationCard.css';
import { NavLink } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';

function ConversationCard(props) {
    let path = `/messages`
    return (
        <NavLink style={{ textDecoration: 'none', color: "black" }} to={{
            pathname: path,
            search: `?conversation=${props.convId}`,
            userData: {
                name: props.username,
                initials: props.initials,
                id: props.recipientId,
                conversation_id: props.convId,
                recipients: props.recipients,
                admin: props.admin,
                type: props.type
            }
        }} >
            <div className="conversationCard">
                <Avatar initials={props.initials} />
                <div className="userTextInfo">
                    <div className="convTextUpper">
                        <h4>{props.recipient}</h4>
                        <p>{props.time}</p>
                    </div>
                    <h5>{props.latest_message}</h5>
                </div>
            </div>
        </NavLink>

    )
}

export default ConversationCard;