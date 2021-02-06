import Avatar from './Avatar';
import './ActiveFriends.css'

function ActiveFriends(props) {
    return (
        <div class="activeFriends">
            <h4>Active Friends</h4>
            <div className="activeList">
                <Avatar style={{ width: "30px", height: "30px", color: "white", margin: " -2px 0.1px" }} initials="P" />
                <p>Prajita Upreti</p>
            </div>



        </div>
    )
}

export default ActiveFriends;