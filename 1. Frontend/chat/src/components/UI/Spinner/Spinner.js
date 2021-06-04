import './Spinner.css'

const Spinner = (props) => {
    return (
        <div class="lds-ring" style={props.outerStyle}>
            <div style={props.style}></div>
            <div style={props.style}></div>
            <div style={props.style}></div>
            <div style={props.style}></div>
        </div>
    )
}
export default Spinner;