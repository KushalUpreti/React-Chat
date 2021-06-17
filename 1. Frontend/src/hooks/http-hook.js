import axios from 'axios';
import { useState, useCallback } from 'react';

export const useHttpClient = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = useCallback(
        async (url, method = "GET", payload, config) => {
            setIsLoading(true);

            if (method === "GET") {
                try {
                    const result = axios.get(url, payload, config);
                    return result;
                } catch (error) {
                    setError(error);
                } finally {
                    setIsLoading(false);
                }

            } else if (method === "POST") {
                try {
                    const result = await axios.post(url, payload, config);
                    return result;
                } catch (error) {
                    setError(error);
                } finally {
                    setIsLoading(false);
                }
            }
        }, [])

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    return { isLoading, error, sendRequest, clearError };
}