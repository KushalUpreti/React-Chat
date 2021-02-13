import './SearchBar.css';
function SearchBar(props) {
    return (
        <form className="searchbar">
            <input type="search" placeholder="Search users" value={props.text || ""} onChange={props.handler} />
        </form>
    )
}

export default SearchBar;