import './Login.css';
import { useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { useHttpClient } from '../hooks/http-hook';
import AuthContext from '../contexts/auth-context';
import Spinner from '../components/UI/Spinner/Spinner';

function Login() {
    const [state, setState] = useState({
        email: "",
        password: "",
    });

    const { sendRequest, isLoading } = useHttpClient();
    const auth = useContext(AuthContext);
    const history = useHistory();

    const login = async (e) => {
        e.preventDefault();
        const payload = {
            email: state.email,
            password: state.password
        }
        let config = {
            headers: {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json",
            }
        }

        const result = await sendRequest("http://localhost:8080/user/login", "POST", payload, config);
        if (!result) { return }
        auth.login(result.data);
    }

    return <>
        {!isLoading ?
            <div className="formContainer">
                <div className="signOrLogForm">
                    <div className="formDiv">
                        <h2 className="signUpH2">Sign in to ReactApp</h2>
                        <p className="signUpP">Fill the form to log in and start connecting.</p>
                        <form className="signUpForm" onSubmit={login}>
                            <input type="text" placeholder="Email" value={state.email} onChange={(event) => {
                                setState({ ...state, email: event.target.value });
                            }} /><br></br>
                            <input type="password" placeholder="Password" value={state.password} onChange={(event) => {
                                setState({ ...state, password: event.target.value });
                            }} /><br></br>
                            <button className="formButton1">Log In</button>
                        </form>
                    </div>
                </div>

                <div className="signOrLogDiv">
                    <h2 className="signUpH3">Hey Friend!</h2>
                    <p className="signUpPLogin">Let's go on a journey and connect with people all around the world.</p>
                    <button className="formButton2" onClick={() => { history.push("/signup") }}>Sign Up</button>
                </div>
            </div> : <Spinner outerStyle={{top:"40%", left:"48%"}} style={{width:"70px",height:"70px"}} />
        }
    </>
}

export default Login;