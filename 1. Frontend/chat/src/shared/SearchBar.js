import './SearchBar.css';
function SearchBar(props) {
    return (
        <form className="searchbar">
            <input type="search" placeholder="Search users" />
        </form>
    )
}

export default SearchBar;