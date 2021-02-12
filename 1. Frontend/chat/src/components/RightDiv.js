import { useState, useContext } from 'react';
import { useHttpClient } from '../hooks/http-hook';
import { useDispatch } from 'react-redux';
import AuthContext from '../contexts/auth-context';
import EdgeContainer from './EdgeContainer';
import Modal from './UI/Modal';
import { addNewConversation } from '../Store/Reducers/conversationSlice';
import Actions from './Actions';
import ActiveFriends from './ActiveFriends';
import Suggested from './Suggested';

function RightDiv(props) {
    const { sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);
    const dispatch = useDispatch();

    const [modal, setModal] = useState(false);
    const [text, setText] = useState("");


    const addFriendHandler = () => {
        setModal(true);
    }

    const onTypeHandler = (e) => {
        setText(e.target.value);
    }

    const onAddFormSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            id: auth.userId,
            friendId: text,
            action: true
        }
        let config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        closeModalHandler();
        const newConversation = await sendRequest("http://localhost:8080/user/addOrRemoveFriend", "POST", payload, config);
        dispatch(addNewConversation(newConversation.data));

    }

    const createGroupHandler = () => {

    }

    const closeModalHandler = () => {
        setModal(false);
    }


    return (
        <EdgeContainer margin="10px 12px 12px 5px">
            {modal ? <Modal show={modal} hide={closeModalHandler} submit={onAddFormSubmit} type={onTypeHandler} textValue={text} /> : null}

            <Actions action="Add Friend" class="fa fa-user-plus" style={{ margin: "15px 5px 0 5px" }} click={addFriendHandler} />
            <Actions action="Create Group" class="fa fa-users" style={{ margin: "10px 5px 0 5px" }} click={createGroupHandler} />
            <ActiveFriends />
            <Suggested />
        </EdgeContainer>
    )
}

export default RightDiv;