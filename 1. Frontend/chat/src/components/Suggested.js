import Avatar from './Avatar';
import AddFriend from './AddFriend';
import './Suggested.css'

function Suggested(props) {
    return (<>
        <div className="suggested">
            <h4>Suggested Friends</h4>
            <AddFriend username="Sweta Shrestha" initials="S" key="eae23123" id="3423e42" addFriend={() => { }} />
        </div>

    </>
    )
}

export default Suggested;