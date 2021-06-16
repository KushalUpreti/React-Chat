import './SendMessage.css';
import { useState } from 'react';
import Button from '../UI/Button/Button';


function SendMessage(props) {
    const [message, setMessage] = useState("");

    function inputHandler(e) {
        setMessage(e.target.value);
    }

    return <form className="sendMessage" onSubmit={(e) => { props.send(e, message); setMessage("") }}>
        <input required type="text" value={message} placeholder="Enter message.." onChange={inputHandler} />
        <Button type="submit" text="Send" />
    </form>
}

export default SendMessage;