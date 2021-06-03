import './AddFriend.css';
import Avatar from '../Avatar/Avatar';

function AddFriend(props) {
    return (
        <div className="addFriend2">
            <div className="activeList" style={{ margin: "0" }}>
                <Avatar style={{ width: "30px", height: "30px", color: "white", margin: " -2px 0.1px" }} initials={props.initials} />
                <p>{props.username}</p>
            </div>
            <i className="fa fa-user-plus" aria-hidden="true" onClick={() => {
                props.addFriend(props.id);
            }}></i>
        </div>
    )
}

export default AddFriend;