import { useEffect, useState } from "react";
import { CONSTANTS } from "./constants";

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${CONSTANTS.API_BASE_URL}/leaderboard`)
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      {data.map((p, i) => (
        <div key={i}>
          Data
        </div>
      ))}
    </div>
  );
}