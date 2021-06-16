import './Button.css';
export default function Button(props) {
    return <button
        type={props.type}
        style={props.buttonStyle || null}
        onClick={props.clickHandler}>{props.text}</button>
}