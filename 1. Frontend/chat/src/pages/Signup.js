import './Signup.css';
import { useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { useHttpClient } from '../hooks/http-hook';
import AuthContext from '../contexts/auth-context';
import Spinner from '../components/UI/Spinner/Spinner';

function Signup() {
    const [state, setState] = useState({
        username: "",
        email: "",
        password: "",
        rePassword: "",
        matched: false,
    });

    const { sendRequest, isLoading } = useHttpClient();
    const auth = useContext(AuthContext);
    const history = useHistory();

    // const checkPasswordMatch = () => {
    //     if (state.password.length > 0 && state.rePassword.length > 0) {
    //         if (state.password === state.rePassword) {
    //             setState({
    //                 ...state,
    //                 matched: true
    //             })
    //         } else {
    //             setState({
    //                 ...state,
    //                 matched: false
    //             })
    //         }
    //     } else {
    //         setState({
    //             ...state,
    //             matched: false
    //         })
    //     }
    // }

    const signup = async (e) => {
        e.preventDefault();
        const password = state.password;
        const rePassword = state.rePassword;
        if (password.length === 0 || rePassword.length === 0) { return; }
        if (password !== rePassword) { return; }

        const payload = {
            username: state.username,
            email: state.email,
            password: state.password
        }
        let config = {
            headers: {
                "Content-Type": "application/json",
            }
        }

        const result = await sendRequest("https://reactchat01.herokuapp.com/user/signup", "POST", payload, config);
        if (!result) { return }
        auth.login(result.data);
    }


    return <>
        {!isLoading ?
            <div className="formContainerSignUp">
                <div className="signOrLogDivSignUp">
                    <h2 className="signUpH3SignUp">Welcome Back</h2>
                    <p className="signUpPLoginSignUp">To stay connected with your friends please log in with your personal info</p>
                    <button className="formButton2SignUp" onClick={() => { history.push("/login") }}>Login</button>
                </div>

                <div className="signOrLogFormSignUp">
                    <div className="formDivSignUp">
                        <h2 className="signUpH2SignUp">Create Account</h2>
                        <p className="signUpPSignUp">Fill the form to create an account</p>
                        <form className="signUpFormSignUp" onSubmit={signup}>
                            <input type="text" placeholder="Name" value={state.username} onChange={(event) => {
                                setState({ ...state, username: event.target.value });
                            }} /><br></br>
                            <input type="text" placeholder="Email" value={state.email} onChange={(event) => {
                                setState({ ...state, email: event.target.value });
                            }} /><br></br>
                            <input type="password" placeholder="Password" value={state.password} onChange={(event) => {
                                setState({ ...state, password: event.target.value });
                            }} /><br></br>
                            <input type="password" placeholder="Re-enter password" value={state.rePassword} onChange={(event) => {
                                setState({ ...state, rePassword: event.target.value });
                            }} /><br></br>
                            <button className="formButton1SignUp">Sign Up</button>
                        </form>
                    </div>
                </div>

            </div> : <Spinner boxStyle={{ marginTop: "40vh", width: "100px", height: "100px" }} borderStyle={{ width: "50px", height: "50px" }} />
        }
    </>
}

export default Signup;