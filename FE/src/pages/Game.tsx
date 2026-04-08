import { useEffect, useState } from "react";
import { socket } from "../socket";

const empty = Array(9).fill(null);

export default function Game({ details }: any) {

    const [board, setBoard] = useState(empty);



    return (
        <div>
            <h2>Tic Tac Toe</h2>
            <p>Room ID</p>
            {details["roomId"]}
            <p>Player1</p>
            {details["player1"]["name"]}
            <p>Player2</p>
            {details["player2"]["name"]}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)" }}>
                {board.map((c, i) => (
                    <button style={{ aspectRatio: "1/1" }} key={i} onClick={() => click(i)}>
                        {c}
                    </button>
                ))}
            </div>
        </div>
    );
}