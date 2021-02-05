import { useContext, useEffect, useState, createContext } from 'react'
import io from 'socket.io-client';
import AuthContext from './auth-context';

const SocketContext = createContext()

export function useSocketObject() {
    return useContext(SocketContext)
}

function SocketProvider({ children }) {
    const [socket, setSocket] = useState()
    const auth = useContext(AuthContext);
    const id = auth.userId;
    useEffect(() => {
        const newSocket = io(
            'http://localhost:8080',
            { query: { id } }
        )

        setSocket(newSocket)

        return () => newSocket.close()
    }, [id])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;