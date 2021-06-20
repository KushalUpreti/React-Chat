import './SendMessage.css';
import Button from '../UI/Button/Button';


function SendMessage(props) {

    return <form className="sendMessage" onSubmit={(e) => { props.send(e, props.message); props.setMessage("") }}>
        <input
            required
            type="text"
            value={props.message}
            placeholder="Enter message.."
            onChange={props.inputHandler}
            onBlur={props.blur} />
        <Button type="submit" text="Send" />
    </form>
}

export default SendMessage;