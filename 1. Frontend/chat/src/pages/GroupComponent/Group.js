import { useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Group.css';

function FriendItem(props) {
    return <div class="friendItem">
        <p>{props.username}</p>
        <input type="checkbox" onChange={props.checkHandler} />
    </div>
}

export default function Group() {
    const [groupName, setGroupName] = useState("");

    const groupNameHandler = (e) => {
        setGroupName(e.target.value);
    }

    return <div class="createGroup">

        <div class="title">
            <h2>Create Group</h2>
            <hr />
        </div>

        <SearchBar placeholder="Group name." value={groupName} handler={groupNameHandler} />
        <SearchBar placeholder="Search Friends." value={groupName} handler={null} />

        <section class="friendList">

        </section>
    </div>
}