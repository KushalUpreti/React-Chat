import React from 'react';
import ReactDOM from 'react-dom'
import './Backdrop.css'

const Backdrop = (props) => {
    return ReactDOM.createPortal(
        <div className="Backdrop" onClick={props.remove}>

        </div>, document.getElementById('backdrop-hook')
    )
}

export default Backdrop;