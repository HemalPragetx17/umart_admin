import { FC, createContext, useContext, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import { WithChildren } from '../../../../umart_admin/helpers';
import { BASE_URL } from '../../../../utils/constants';
type SocketContextProps = {
  socket: Socket | undefined;
};
const initialContextValue: SocketContextProps = {
  socket: undefined,
};
const SocketContext = createContext<SocketContextProps>(initialContextValue);
const useSocket = () => {
  return useContext(SocketContext);
};
const SocketProvider: FC<WithChildren> = ({ children }) => {
  const socket = io(BASE_URL, {
    query: {
      interface: 'i1',
    },
    reconnectionAttempts: 4,
  });
  const socketRef = useRef(socket);
  useEffect(() => {
    socketRef.current.connect();
    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
export { SocketProvider, useSocket };
