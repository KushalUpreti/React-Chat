import './SearchBar.css';
function SearchBar(props) {
    return (
        <form className="searchbar" onSubmit={props.onSubmit}>
            <input
                type="search"
                placeholder={props.placeholder}
                value={props.text || ""}
                onChange={props.handler}
                style={props.style || null}
            />
        </form>
    )
}

export default SearchBar;