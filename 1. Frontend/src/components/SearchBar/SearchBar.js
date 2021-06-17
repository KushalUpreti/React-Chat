import './SearchBar.css';
function SearchBar(props) {
    return (
        <form className="searchbar" onSubmit={props.onSubmit} style={props.formStyle}>
            <input
                type="search"
                placeholder={props.placeholder}
                value={props.text || ""}
                onChange={props.handler}
                style={props.style || null}
                disabled={props.disabled}
            />
        </form>
    )
}

export default SearchBar;