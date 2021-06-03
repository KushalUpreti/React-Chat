import Avatar from '../Avatar/Avatar';
import './UserInfo.css';

function UserInfo(props) {
    const initials = props.username.charAt(0);

    return <div className="userInfo">
        <Avatar initials={initials} />
        <div className="userTextInfo">
            <h4>{props.username}</h4> 
            <h5>Id: {props.userId}</h5>
        </div>
    </div>
}

export default UserInfo;