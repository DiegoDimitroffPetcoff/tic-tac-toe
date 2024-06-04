import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import cofetti from "canvas-confetti";
import "./App.css";
const TURN = { o: "O", x: "X" };
const WINNERCOMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    if (boardFromStorage) return JSON.parse(boardFromStorage);
    return Array(9).fill(null);
  });
  const [turn, setTurn] = useState(() => {
    const turnFromSotorage = window.localStorage.getItem("turn");
    return turnFromSotorage ?? TURN.x;
  });
  const [winner, setWInner] = useState(null);

  const Square = ({ children, isSelected, updateBoard, index }) => {
    const className = `square ${isSelected ? "is-selected" : ""}`;
    function handleClick() {
      updateBoard(index);
    }
    return (
      <div onClick={handleClick} className={className}>
        {children}
      </div>
    );
  };

  const updateBoard = (index) => {
    if (board[index] || winner) {
      return;
    }
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    const newTurn = turn === TURN.o ? TURN.x : TURN.o;
    setTurn(newTurn);
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", newTurn);
    const newWinner = checkWInner(newBoard);
    if (newWinner) {
      setWInner(newWinner);
      cofetti();
    } else if (checkEndGame(newBoard)) {
      setWInner(false);
    }
  };

  const checkWInner = (boardCheck) => {
    for (const combo of WINNERCOMBINATIONS) {
      const [a, b, c] = combo;
      if (
        boardCheck[a] &&
        boardCheck[a] === boardCheck[b] &&
        boardCheck[b] === boardCheck[c]
      ) {
        return boardCheck[a];
      }
    }
    return null;
  };
  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURN.o);
    setWInner(null);
    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };
  return (
    <main className="board">
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square index={index} key={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelected={turn === TURN.o}>{TURN.o}</Square>
        <Square isSelected={turn === TURN.x}>{TURN.x}</Square>
      </section>
      {winner !== null && (
        <section className="winner">
          <div className="text">
            <h2>{winner === false ? "Empate" : "Gano"}</h2>
            <header className="win">
              {winner && <Square>{winner}</Square>}
            </header>
            <button onClick={resetGame}>Empezar de nuevo</button>
          </div>
        </section>
      )}
      <footer>
        <button onClick={resetGame}>Empezar de nuevo</button>
      </footer>
    </main>
  );
}

export default App;
