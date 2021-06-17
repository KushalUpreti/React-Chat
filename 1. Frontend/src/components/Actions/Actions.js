import './Actions.css';

function Actions(props) {
    return (
        <div className="addFriend" style={props.style}>
            <h5>{props.action}</h5>
            <i className={props.class} aria-hidden="true" onClick={props.click}></i>
        </div>
    )
}

export default Actions;