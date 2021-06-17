import Avatar from '../Avatar/Avatar';
import './ActiveFriends.css'

function ActiveFriends(props) {
    return (
        <div className="activeFriends">
            <h4>Active Friends</h4>

            {props.active.map((item) => {
                return <div className="activeList">
                    <Avatar style={{ width: "30px", height: "30px", color: "white", margin: " -2px 0.1px" }} initials={item.initials} />
                    <div className="green"></div>
                    <p>{item.username}</p>
                </div>
            })}




        </div>
    )
}

export default ActiveFriends;