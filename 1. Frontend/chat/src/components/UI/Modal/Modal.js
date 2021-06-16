import './Modal.css';
import Backdrop from '../Backdrop/Backdrop';


const Modal = (props) => {
    return <>
        {props.show && <Backdrop remove={props.hide} />}
        <div className="Modal">
            {props.children}
        </div>
    </>
}

export default Modal;