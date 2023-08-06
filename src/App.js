import React, { useState, useEffect, useCallback } from "react";

const initialSnake = [[10, 10]];
const initialApple = [[15, 15]];
const initialDirection = [0, -1];
const maxSpeed = 200 * Math.pow(0.9, 8);

const App = () => {
  const [snake, setSnake] = useState(initialSnake);
  const [apple, setApple] = useState(initialApple);
  const [dir, setDir] = useState(initialDirection);
  const [speed, setSpeed] = useState(200);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("start"); // start, running, gameOver

  // update the direction based on the key pressed
  const changeDirection = useCallback((event) => {
    const newDirection = event.key;
    let newDir;

    switch (newDirection) {
      case "ArrowUp":
        newDir = [0, -1];
        break;
      case "ArrowDown":
        newDir = [0, 1];
        break;
      case "ArrowRight":
        newDir = [1, 0];
        break;
      case "ArrowLeft":
        newDir = [-1, 0];
        break;
      default:
        return;
    }

    setDir(newDir);
  }, []);

  // new function to generate a new apple location
  const createApple = useCallback(() => {
    while (true) {
      const newApple = [
        [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)],
      ];
      if (
        !snake.some(
          (cell) => cell[0] === newApple[0][0] && cell[1] === newApple[0][1]
        )
      ) {
        return newApple;
      }
    }
  }, [snake]);

  const startGame = useCallback(() => {
    setGameStatus("running");
    setSnake(initialSnake);
    setApple(initialApple);
    setDir(initialDirection);
    setSpeed(200);
    setScore(0);
  }, []);

  const restartGame = useCallback(() => {
    setGameStatus("start");
  }, []);

  // the main game loop
  const runGame = useCallback(() => {
    if (gameStatus !== "running") return;

    const newSnake = [...snake];
    const head = [newSnake[0][0] + dir[0], newSnake[0][1] + dir[1]];
    newSnake.unshift(head);

    // game over conditions
    if (
      head[0] < 0 ||
      head[1] < 0 ||
      head[0] >= 20 ||
      head[1] >= 20 ||
      snake.some((cell) => cell[0] === head[0] && cell[1] === head[1])
    ) {
      setGameStatus("gameOver");
      return;
    }

    // if the snake ate the apple
    if (apple[0][0] === head[0] && apple[0][1] === head[1]) {
      // generate a new random apple
      setApple(createApple());
      setScore((score) => score + 1);
      setSpeed((speed) => Math.max(speed * 0.9, maxSpeed));
    } else {
      // remove the tail of the snake (since it didn't eat an apple)
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, apple, dir, createApple, gameStatus]);

  useEffect(() => {
    const interval = setInterval(runGame, speed);
    window.addEventListener("keydown", changeDirection);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", changeDirection);
    };
  }, [runGame, speed, changeDirection, gameStatus]); // re-run useEffect when speed changes

  return (
    <div className="App">
      <h1 className="game-title">Snake Game</h1>
      {gameStatus === "start" && (
        <button onClick={startGame}>Start Game</button>
      )}
      {gameStatus === "gameOver" && (
        <div>
          <div>Game Over</div>
          <button onClick={restartGame}>Restart Game</button>
        </div>
      )}
      <div>Score: {score}</div> {/* display the score */}
      <div className="game-area">
        {snake.map((cell, i) => (
          <div
            key={i}
            className="snake-cell"
            style={{ gridColumnStart: cell[0] + 1, gridRowStart: cell[1] + 1 }}
          />
        ))}
        {apple.map((cell, i) => (
          <div
            key={i}
            className="apple-cell"
            style={{ gridColumnStart: cell[0] + 1, gridRowStart: cell[1] + 1 }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
