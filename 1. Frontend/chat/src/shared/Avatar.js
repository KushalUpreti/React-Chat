
function Avatar(props) {
    return (
        <img style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%"
        }} alt="user avatar" src={props.src}> </img>
    )
}

export default Avatar;