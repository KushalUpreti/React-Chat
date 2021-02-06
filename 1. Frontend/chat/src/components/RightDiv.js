import EdgeContainer from './EdgeContainer';
import Actions from './Actions';
import ActiveFriends from './ActiveFriends';
import Suggested from './Suggested';

function RightDiv(props) {
    return (
        <EdgeContainer margin="10px 12px 12px 5px">
            <Actions action="Add Friend" class="fa fa-user-plus" style={{ margin: "15px 5px 0 5px" }} />
            <Actions action="Create Group" class="fa fa-users" style={{ margin: "10px 5px 0 5px" }} />
            <ActiveFriends />
            <Suggested />
        </EdgeContainer>
    )
}

export default RightDiv;