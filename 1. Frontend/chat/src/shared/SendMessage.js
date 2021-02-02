import './SendMessage.css';

function SendMessage(props) {
    return <form className="sendMessage">
        <input type="text" placeholder="Enter message.." />
        <button>Send</button>
    </form>
}

export default SendMessage;