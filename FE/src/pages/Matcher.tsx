import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Matcher({ name, onMatch }: any) {
  const [time, setTime] = useState(30);

  useEffect(() => {
    socket.emit("nickname", name);
    socket.emit("find_match");

    const handleMatch = (match: any) => {
      onMatch(match);
    };

    socket.on("match_found", handleMatch);

    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 0) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      socket.off("match_found", handleMatch);
    };
  }, [name]);

  return (
    <div>
      <h2>Playing as: {name}</h2>
      <h2>Finding player...</h2>
      <p>{time <= 0 ? "Unable to find player" : `${time}s`}</p>
      <button onClick={() => socket.disconnect()}>Cancel</button>
    </div>
  );
}