import './Actions.css';

function Actions(props) {
    return (
        <div className="addFriend" style={props.style}>
            <h5>{props.action}</h5>
            <i class={props.class} aria-hidden="true"></i>
        </div>
    )
}

export default Actions;