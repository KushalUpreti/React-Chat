import './Avatar.css'

function Avatar(props) {
    return (
        <div className="avatar" style={props.style || null}>
            <h2 style={{ padding: "2px", color: "white" }}>{props.initials}</h2>
        </div>
    )
}

export default Avatar;