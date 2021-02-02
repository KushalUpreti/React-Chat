import './MidDiv.css';
import MessageHeader from './MessageHeader';
import ConversationHolder from './CoversationHolder';
import SendMessage from './SendMessage';

function MidDiv(props) {
    return <div className="midDiv">
        <MessageHeader />
        <div className="conversation">
            <ConversationHolder />
            <SendMessage />
        </div>
    </div>
}

export default MidDiv;