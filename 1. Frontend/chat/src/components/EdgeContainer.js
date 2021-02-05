import './EdgeContainer.css';
function EdgeContainer(props) {
    return (
        <div className="edgeDiv" style={{ margin: props.margin }}>
            {props.children}
        </div>
    )
}

export default EdgeContainer;