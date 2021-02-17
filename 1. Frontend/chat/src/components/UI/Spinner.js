import React from 'react';
import './Spinner.css'

const Spinner = (props) => {
    return (
        <React.Fragment>
            <div class="spinner-box" style={props.boxStyle}>
                <div class="circle-border" style={props.borderStyle}>
                    <div class="circle-core"></div>
                </div>
            </div>
        </React.Fragment>
    )
}
export default Spinner;