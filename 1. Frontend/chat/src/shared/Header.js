import './Header.css';
import { NavLink } from 'react-router-dom';

function Header(props) {
    return (
        <header>
            <NavLink to="/" style={{ textDecoration: "none" }}>
                <h3 className="headerh2">{props.title}</h3>
            </NavLink>

            <h5 className="headerh5">{props.caption}</h5>
        </header>
    )
}

export default Header;