import './Header.css';
function Header(props) {
    return (
        <header>
            <h3 className="headerh2">{props.title}</h3>
            <h5 className="headerh5">{props.caption}</h5>
        </header>
    )
}

export default Header;