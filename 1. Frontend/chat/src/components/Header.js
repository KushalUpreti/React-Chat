import './Header.css';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from "../contexts/auth-context";

function Header(props) {
    const auth = useContext(AuthContext);
    return (
        <header>
            <NavLink to="/" style={{ textDecoration: "none" }}>
                <h3 className="headerh2">{props.title}</h3>
            </NavLink>

            <button className="logout" onClick={auth.logout}>Log Out</button>
        </header>
    )
}

export default Header;