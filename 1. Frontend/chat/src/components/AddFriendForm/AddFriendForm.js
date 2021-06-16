import './AddFriendForm.css';

export default function AddFriendForm(props) {
    return <section className="containForm">
        <h3>Fill the form with your friend's Id.</h3>
        <form className="idForm" onSubmit={props.onAddFormSubmit}>
            <input type="text" placeholder="Enter Id" onChange={props.onTypeHandler} value={props.text} />
            <button className="submitId">Add</button>
        </form>
    </section>
}