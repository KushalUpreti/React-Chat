import './ConversationCard.css';
import { NavLink } from 'react-router-dom';
import Avatar from './Avatar';

function ConversationCard(props) {
    let path = `/messages/${props.recipientId}`
    return (
        <NavLink to={path} style={{ textDecoration: 'none', color: "black" }}>
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