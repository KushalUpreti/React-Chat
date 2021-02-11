import './Modal.css';
import Backdrop from './Backdrop';


const Modal = (props) => {
    return <>
        {props.show && <Backdrop remove={props.hide} />}
        <div className="Modal">
            <section className="containForm">
                <h3>Fill the form with your friend's Id.</h3>
                <form className="idForm" onSubmit={props.submit}>
                    <input type="text" placeholder="Enter Id" onChange={props.type} value={props.textValue} />
                    <button className="submitId">Add</button>
                </form>
            </section>


        </div>
    </>
}

export default Modal;