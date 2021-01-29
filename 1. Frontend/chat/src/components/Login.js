import './Login.css';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useHttpClient } from '../hooks/http-hook';
import { useContextObj } from '../contexts/auth-context';

function Login() {
    const [state, setState] = useState({
        email: "",
        password: "",
    });

    const { isLoading, error, clearError, sendRequest } = useHttpClient();
    const auth = useContextObj();
    const history = useHistory();


    const login = async () => {
        const payload = {
            email: state.email,
            password: state.password
        }
        let config = {
            headers: {
                "Content-Type": "application/json",
            }
        }

        const result = await sendRequest("http://localhost:8080/user/login", "POST", payload, config);
        console.log(result);
        if (!result) { return }
        auth.login(result);
    }


    return <>
        <div className="formContainer">
            <div className="signOrLogForm">
                <div className="formDiv">
                    <h2 className="signUpH2">Sign in to ReactApp</h2>
                    <p className="signUpP">Fill the form to log in and start connecting.</p>
                    <form className="signUpForm">
                        <input type="text" placeholder="Email" value={state.email} onChange={(event) => {
                            setState({ ...state, email: event.target.value });
                        }} /><br></br>
                        <input type="password" placeholder="Password" value={state.password} onChange={(event) => {
                            setState({ ...state, password: event.target.value });
                        }} /><br></br>
                    </form>
                    <button className="formButton1" onClick={() => { login(); }}>Log In</button>
                </div>
            </div>

            <div className="signOrLogDiv">
                <h2 className="signUpH3">Hey Friend!</h2>
                <p className="signUpPLogin">Let's go on a journey and connect with people all around the world.</p>
                <button className="formButton2" onClick={() => { history.push("/signup") }}>Sign Up</button>
            </div>
        </div>
    </>
}

export default Login;