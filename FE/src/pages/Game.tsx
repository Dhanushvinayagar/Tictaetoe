import { useEffect, useState } from "react";
import { socket } from "../socket";

const emptyBoard = Array(9).fill(null);

export default function Game({ details }: any) {
    const [board, setBoard] = useState(emptyBoard);
    const [turn, setTurn] = useState(false);
    const [winner, setWinner] = useState(null);
    const mySymbol =
        details.player1.socketId === socket.id ? "X" : "O";
    const opponentSymbol = mySymbol === "X" ? "O" : "X";

    // Handle click
    const click = (i: number) => {
        if (board[i] || !turn) return;

        const newBoard = [...board];
        newBoard[i] = mySymbol;

        setBoard(newBoard);

        socket.emit("move", {
            index: i,
            board: newBoard,
            roomId: details.roomId,
        });

        setTurn(false);
    };

    useEffect(() => {
        // Set first turn
        if (details.player1.socketId === socket.id) {
            setTurn(true);
        }

        const handleMove = (data: any) => {
            setBoard((prev) => {
                const newBoard = [...prev];
                newBoard[data.index] = opponentSymbol;
                return newBoard;
            });

            setTurn(true);
        };

        const handleLeave = () => {
            alert("Opponent left the game");
        };

        socket.on("opponent_move", handleMove);
        socket.on("opponent_left", handleLeave);

        socket.on("game_over", (data) => {
            setWinner(data.player.name);
        })

        return () => {
            socket.off("opponent_move", handleMove);
            socket.off("opponent_left", handleLeave);
        };
    }, []);

    return (
        <div>
            <h2>Tic Tac Toe</h2>
            <p>You are playing as : {mySymbol}</p>
            {
                winner ?
                <p>{winner} won the game</p> :
                <p>{turn ? "Your turn" : "Opponent's turn"}</p>
            }

            <p>
                {details["player1"]["name"]} - {details["player1"]["symbol"]}
                {"  |  "}
                {details["player2"]["name"]} - {details["player2"]["symbol"]}
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 100px)",
                    gap: "5px",
                }}
            >
                {board.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => click(i)}
                        disabled={!turn}
                        style={{ aspectRatio: "1/1", fontSize: "24px" }}
                    >
                        {c}
                    </button>
                ))}
            </div>
        </div>
    );
}