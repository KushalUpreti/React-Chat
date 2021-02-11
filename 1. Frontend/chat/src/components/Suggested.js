import Avatar from './Avatar';
import './Suggested.css'

function Suggested(props) {
    return (<>
        <div className="suggested">
            <h4>Suggested Friends</h4>
            <div className="suggestedList">
                <Avatar style={{ width: "30px", height: "30px", color: "white", margin: " -2px 0.1px" }} initials="S" />
                <p>Sweta Shrestha</p>
            </div>
        </div>

    </>
    )
}

export default Suggested;