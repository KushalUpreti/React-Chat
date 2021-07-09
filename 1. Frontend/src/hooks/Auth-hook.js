import { useState, useEffect, useCallback } from 'react';

export const useAuth = () => {
    let logoutTimer;

    const [token, setToken] = useState("");
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userDetails, setUserDetails] = useState({
        username: null,
        userId: null
    });

    const login = useCallback((recievedData) => {
        setUserDetails({
            username: recievedData.username,
            userId: recievedData.userId
        });
        setToken(recievedData.token);
        const tokenExpirationDate =
        recievedData.expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 48);
        setTokenExpirationDate(tokenExpirationDate);

        let obj = {
            token: recievedData.token,
            username: recievedData.username,
            userId: recievedData.userId,
            expiration: tokenExpirationDate.toISOString()
        }
        obj = JSON.stringify(obj);
        localStorage.setItem("userData", obj);
    }, []);

    const logout = useCallback(() => {
        setToken("");
        setUserDetails({
            username: null,
            userId: null
        });
        setTokenExpirationDate(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
          const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
          logoutTimer = setTimeout(logout, remainingTime);
        } else {
          clearTimeout(logoutTimer);
        }
      }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            const recievedData = {
                token: storedData.token,
                username: storedData.username,
                userId: storedData.userId,
                expiration:storedData.expiration
            }
            login(recievedData);
        }
    }, [login])

    return { token, userDetails, login, logout };
}