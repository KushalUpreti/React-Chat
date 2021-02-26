import './Spinner.css'

const Spinner = (props) => {
    return (
        <div class="lds-ripple" style={props.style}>
            <div></div>
            <div></div>
        </div>
    )
}
export default Spinner;