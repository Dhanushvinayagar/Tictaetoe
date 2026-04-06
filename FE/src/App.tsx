import { useEffect, useState } from 'react'
import './App.css'
import { io } from "socket.io-client";

function App() {

  const [socketId, setSocketId] = useState<string|undefined>("");

  useEffect(() => {
    const socket = io("http://localhost:8000"); // 👈 use http, not ws

    socket.on("connect", () => {
      console.log(socket.id);
      setSocketId(socket.id); // 👈 update state
    });

    return () => {
      socket.disconnect(); // 👈 cleanup
    };
  }, []);

  return (
    <>
      <h1>Socket.IO Client</h1>
      <p>Socket ID: {socketId}</p>
    </>
  )

}

export default App
