import { useState, useEffect, useCallback } from 'react';

export const useAuth = () => {

    const [token, setToken] = useState("");
    const [userDetails, setUserDetails] = useState({
        username: null,
        userId: null
    });



    const login = useCallback((recievedData) => {
        setToken(recievedData.token);
        setUserDetails({
            username: recievedData.username,
            userId: recievedData.userId
        });

        let obj = {
            token: recievedData.token,
            username: recievedData.username,
            userId: recievedData.userId
        }
        obj = JSON.stringify(obj);
        localStorage.setItem("userData", obj);
    }, []);

    const logout = useCallback(() => {
        setToken("");
        setUserDetails(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token) {
            const recievedData = {
                token: storedData.token,
                username: storedData.username,
                userId: storedData.userId
            }
            login(recievedData);
        }
    }, [login])

    return { token, userDetails, login, logout };
}