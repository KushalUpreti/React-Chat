import './SearchContainer.css';
import AddFriend from './AddFriend';

function SearchContainer(props) {
    return (
        <div className="searchContainer">
            {props.searches.length > 0 ? props.searches.map(item => {
                return <AddFriend username={item.username} initials={item.initials} key={item._id} id={item._id} addFriend={props.addFriend} />
            }) : null}

        </div>
    )
}

export default SearchContainer;