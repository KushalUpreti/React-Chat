import Avatar from './Avatar';
import './UserInfo.css';

function UserInfo(props) {
    return <div className="userInfo">
        <Avatar src="https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-0/p526x296/71275162_2365160913696634_6213709240742182912_n.jpg?_nc_cat=103&ccb=2&_nc_sid=8bfeb9&_nc_ohc=NqT0sCJjgaYAX-YSVB9&_nc_ht=scontent-lht6-1.xx&tp=6&oh=4013d1c30fd9fc29ad563d98d0100efb&oe=603B3834" />
        <div className="userTextInfo">
            <h4>{props.username}</h4>
            <h5>props.userId</h5>
        </div>
    </div>
}

export default UserInfo;