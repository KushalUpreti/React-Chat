import { useContext, useEffect, useState, createContext } from 'react'
import io from 'socket.io-client'

const SocketContext = createContext()

export function useSocketObject() {
    return useContext(SocketContext)
}

function SocketProvider({ id, children }) {
    const [socket, setSocket] = useState()

    useEffect(() => {
        const newSocket = io(
            'http://localhost:5000',
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