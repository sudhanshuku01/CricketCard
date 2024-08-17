import { useNavigate, useParams } from "react-router-dom";
import socket from "../../utils/Socket";
import { useEffect, useState } from "react";
import { CricketerData } from "../../utils/Players";
import Layout from "../../layout/Layout";
import toast from "react-hot-toast";
import { useGameContext } from "../../context/GameContext";
import player_IMG from '../../assets/images/playerimages.jpg'

const attributes: string[] = [
  "match",
  "run",
  "average",
  "notout",
  "highest",
  "100s",
  "50s",
  "wicket",
  "catch",
  "ball",
];

const Game = () => {
  const { username, setGameoverData } = useGameContext();
  const navigate = useNavigate();

  const { room } = useParams();
  const [cardLeft, setCardLeft] = useState<number | null>(null);
  const [yourcardName, setYourCardName] = useState<string>("unknown");
  const [yourTurn, setYourTurn] = useState<boolean>(false);
  const [yourScore, setYourScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [opponentcardName, setOpponentCardName] = useState<string>("unknown");
  const [betResult, setBetResult] = useState<{
    betAttribute: string;
    resultMessage: string;
  } | null>(null);

  const [nextTurnCountDown, setNextTurnCountDown] = useState<{
    set: boolean;
    value: number;
  }>({ set: false, value: 0 });

  useEffect(() => {
    if (!username) {
      navigate("/");
    }
  }, [username]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "If you leave, you will lose the game!";
      return "If you leave, you will lose the game!";
    };

    const handleUnload = () => {
      socket.emit("userLeft", { room, username });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [room, username]);

  useEffect(() => {
    if (nextTurnCountDown.set && nextTurnCountDown.value > 0) {
      const timerId = setInterval(() => {
        setNextTurnCountDown((prevState) => ({
          ...prevState,
          value: prevState.value - 1,
        }));
      }, 1000);
      return () => clearInterval(timerId);
    } else if (nextTurnCountDown.value === 0 && nextTurnCountDown.set) {
      setBetResult(null);
      setOpponentCardName("unknown");
      socket.emit("requestgamestate", { room });
      setNextTurnCountDown({
        set: false,
        value: 0,
      });
    }
  }, [nextTurnCountDown]);

  useEffect(() => {
    socket.on("gameover", ({ yourScore, yourOpponentScore }) => {
      setGameoverData({
        yourScore,
        yourOpponentScore,
        message: "Game Over",
      });
      navigate("/");
    });

    socket.emit("requestgamestate", { room });

    socket.on(
      "getgamestate",
      ({ yourCardName, yourTurn, yourScore, opponentScore, cardLeft }) => {
        setYourTurn(() => yourTurn);
        setYourScore(() => yourScore);
        setOpponentScore(() => opponentScore);
        setCardLeft(() => cardLeft);
        setYourCardName(() => yourCardName);
      }
    );

    socket.on(
      "betresult",
      ({ betAttribute, resultMessage, OpponentBetCardName }) => {
        setBetResult({
          betAttribute,
          resultMessage,
        });
        setOpponentCardName(OpponentBetCardName);
        setNextTurnCountDown({
          set: true,
          value: 25,
        });
      }
    );

    socket.on("opponentLeft", ({ message }) => {
      toastMessage(message);
      setGameoverData({
        yourScore: 50,
        yourOpponentScore: 0,
        message: "User Left",
      });
      navigate("/");
    });

    return () => {
      socket.off("requestgamestate");
      socket.off("getgamestate");
      socket.off("betresult");
      socket.off("gameover");
      socket.off("opponentLeft");
    };
  }, [room]);

  const handleBet = (attribute: string) => {
    socket.emit("bet", {
      attribute,
      room,
    });
  };

  const toastMessage = (msg: string, icon?: string) => {
    toast(msg, {
      duration: 2000,
      icon: icon,
      style: {
        background: "rgba(255, 255, 255, 0.1)",
        marginBottom: "10px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: "300",
        fontSize: "15px",
        color: "#fff",
        padding: "6px 12px",
        borderRadius: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 0 2px #fff",
        backdropFilter: "blur(10px)",
      },
      iconTheme: {
        primary: "#713200",
        secondary: "#FFFAEE",
      },
    });
  };

  return (
    <Layout>
      <div className="game">
        <div className="score">
          <p>
            Your score:{" "}
            <span style={{ fontWeight: "600", color: "#1deb1d" }}>
              {" "}
              {yourScore}
            </span>
          </p>
          <p>
            Opponent score:{" "}
            <span style={{ fontWeight: "600", color: "#1deb1d" }}>
              {opponentScore}
            </span>
          </p>
          <p>
            Cards Left:{" "}
            <span style={{ fontWeight: "600", color: "#1deb1d" }}>
              {cardLeft}
            </span>
          </p>
        </div>
        {betResult ? (
          <div className="betresult">
            {betResult && (
              <p>
                {betResult.resultMessage},{" "}
                <span style={{ fontWeight: "600", color: "#1deb1d" }}>
                  {betResult.betAttribute} !
                </span>
              </p>
            )}
            {nextTurnCountDown.set && (
              <p>
                Next turn in:{" "}
                <span style={{ fontWeight: "600", color: "#1deb1d" }}>
                  {nextTurnCountDown.value} s
                </span>
              </p>
            )}
          </div>
        ) : (
          yourTurn && (
            <div className="betbuttons">
              {attributes.map((attribute) => (
                <button key={attribute} onClick={() => handleBet(attribute)}>
                  {attribute}
                </button>
              ))}
            </div>
          )
        )}
        <div className="cards">
          <div className="yourcardcontainer">
            <h1>Your Card</h1>
            <div className="cardwrapper">
              <div
                className={`card ${
                  yourcardName === "unknown" ? "flipped" : ""
                }`}
              >
                <div
                  style={{ backgroundColor: CricketerData[yourcardName].color }}
                  className="cardfront"
                >
                  <div className="image">
                    <img
                      // src={CricketerData[yourcardName].image}
                      src={player_IMG}
                      alt={CricketerData[yourcardName].fullname}
                    />
                    <h3>{yourcardName}</h3>
                  </div>
                  <div className="generalinfo">
                    <p>
                      <span>DOB:</span>{" "}
                      <span>{CricketerData[yourcardName].dob}</span>
                    </p>
                  </div>
                  <div className="container">
                    <h4>ODI Stats</h4>
                    <div className="content">
                      <p>
                        <span className="label">Matches:</span>{" "}
                        <span className="value">
                          {CricketerData[yourcardName].odi.match}
                        </span>
                      </p>
                      <p>
                        <span className="label">Runs:</span>{" "}
                        <span className="value">
                          {CricketerData[yourcardName].odi.run}
                        </span>
                      </p>
                      <p>
                        <span className="label">Average:</span>{" "}
                        <span className="value">
                          {CricketerData[yourcardName].odi.average}
                        </span>
                      </p>
                      <p>
                        <span className="label">Not Out:</span>{" "}
                        <span className="value">
                          {CricketerData[yourcardName].odi.notout}
                        </span>
                      </p>
                      <p>
                        <span className="label">Highest:</span>{" "}
                        <span className="value">
                          {CricketerData[yourcardName].odi.highest}
                        </span>
                      </p>
                      <p>
                        <span className="label">100s:</span>{" "}
                        <span className="value">
                          {CricketerData[yourcardName].odi["100s"]}
                        </span>
                      </p>
                      <p>
                        <span className="label">50s:</span>{" "}
                        <span className="value">
                          {CricketerData[yourcardName].odi["50s"]}
                        </span>
                      </p>
                      <p>
                        <span className="label">Wickets:</span>{" "}
                        <span className="value">
                          {CricketerData[yourcardName].odi.wicket}
                        </span>
                      </p>
                      <p>
                        <span className="label">Catches:</span>{" "}
                        <span className="value">
                          {CricketerData[yourcardName].odi.catch}
                        </span>
                      </p>
                      <p>
                        <span className="label">Balls:</span>{" "}
                        <span className="value">
                          {CricketerData[yourcardName].odi.ball}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="cardback"></div>
              </div>
            </div>
          </div>
          <div className="opponentcardcontainer">
            <h1>Opponent Card</h1>
            <div className="cardwrapper">
              <div
                className={`card ${
                  opponentcardName === "unknown" ? "flipped" : ""
                }`}
              >
                <div
                  style={{
                    backgroundColor: CricketerData[opponentcardName].color,
                  }}
                  className="cardfront"
                >
                  <div className="image">
                    <img
                      // src={CricketerData[opponentcardName].image}
                      src={player_IMG}
                      alt={CricketerData[opponentcardName].fullname}
                    />
                    <h3>{opponentcardName}</h3>
                  </div>
                  <div className="generalinfo">
                    <p>
                      <span>DOB:</span>{" "}
                      <span>{CricketerData[opponentcardName].dob}</span>
                    </p>
                  </div>
                  <div className="container">
                    <h4>ODI Stats</h4>
                    <div className="content">
                      <p>
                        <span className="label">Matches:</span>{" "}
                        <span className="value">
                          {CricketerData[opponentcardName].odi.match}
                        </span>
                      </p>
                      <p>
                        <span className="label">Runs:</span>{" "}
                        <span className="value">
                          {CricketerData[opponentcardName].odi.run}
                        </span>
                      </p>
                      <p>
                        <span className="label">Average:</span>{" "}
                        <span className="value">
                          {CricketerData[opponentcardName].odi.average}
                        </span>
                      </p>
                      <p>
                        <span className="label">Not Out:</span>{" "}
                        <span className="value">
                          {CricketerData[opponentcardName].odi.notout}
                        </span>
                      </p>
                      <p>
                        <span className="label">Highest:</span>{" "}
                        <span className="value">
                          {CricketerData[opponentcardName].odi.highest}
                        </span>
                      </p>
                      <p>
                        <span className="label">100s:</span>{" "}
                        <span className="value">
                          {CricketerData[opponentcardName].odi["100s"]}
                        </span>
                      </p>
                      <p>
                        <span className="label">50s:</span>{" "}
                        <span className="value">
                          {CricketerData[opponentcardName].odi["50s"]}
                        </span>
                      </p>
                      <p>
                        <span className="label">Wickets:</span>{" "}
                        <span className="value">
                          {CricketerData[opponentcardName].odi.wicket}
                        </span>
                      </p>
                      <p>
                        <span className="label">Catches:</span>{" "}
                        <span className="value">
                          {CricketerData[opponentcardName].odi.catch}
                        </span>
                      </p>
                      <p>
                        <span className="label">Balls:</span>{" "}
                        <span className="value">
                          {CricketerData[opponentcardName].odi.ball}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="cardback">
                  <p>
                    {yourTurn ? "Your Turn to Bet" : "Opponent's Turn to Bet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Game;
