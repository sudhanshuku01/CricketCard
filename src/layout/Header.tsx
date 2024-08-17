import { useGameContext } from "../context/GameContext";
import { GiTwoCoins } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";

const Header = () => {
  const { username, points, setPoints, gameoverData, setGameoverData } =
    useGameContext();

  const showResult = (num1: number, num2: number): JSX.Element => {
    const points = (num1 - num2) * 10;
    return (
      <p>
        Your Points ={" "}
        <span style={{ color: "#1deb1d" }}>
          {num1} - {num2} * 10 = {points}
        </span>
      </p>
    );
  };

  const closeScoreBox = () => {
    if (gameoverData) {
      const points =
        (gameoverData.yourScore - gameoverData.yourOpponentScore) * 10;
      setPoints((prevdata) => prevdata + points);
    }
    setGameoverData(null);
  };

  return (
    <div className="header">
      <div className="title">
        <h1>
          CRICKET <span>CARD</span>
        </h1>
      </div>
      {username && (
        <div className="user">
          <p className="username">{username}</p>
          <p className="points">
            <GiTwoCoins /> {points}
          </p>
        </div>
      )}
      {gameoverData && (
        <div className="gameover">
          <div className="data">
            <h1>{gameoverData.message}</h1>
            <div className="item">
              <p>
                Your Score:{" "}
                <span style={{ color: "#1deb1d" }}>
                  {gameoverData.yourScore}
                </span>
              </p>
              <p>
                Opponent's Score:{" "}
                <span style={{ color: "#1deb1d" }}>
                  {gameoverData.yourOpponentScore}
                </span>
              </p>
              {showResult(
                gameoverData.yourScore,
                gameoverData.yourOpponentScore
              )}
            </div>
            <button onClick={closeScoreBox}>
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
