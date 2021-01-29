import { createContext, useContext } from 'react';
import { useAuth } from '../hooks/Auth-hook';

const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    username: null,
    userId: null,
    login: () => { },
    logout: () => { }
})

export function useContextObj() {
    return useContext(AuthContext);
}

const AuthProvider = (props) => {
    const { login, logout, token, userDetails } = useAuth();

    return <AuthContext.Provider value={{
        isLoggedIn: !!token,
        login,
        logout,
        token,
        username: userDetails.username,
        userId: userDetails.userId
    }}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthProvider;