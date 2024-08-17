import React, { FormEvent, useEffect, useState } from "react";
import socket from "../../utils/Socket";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import toast from "react-hot-toast";
import { useGameContext } from "../../context/GameContext";
import Footer from "../../layout/Footer";
import Introduction from "./Introduction";

interface onlineUsersType {
  socketId: string;
  status: string;
  username: string;
}

const Home: React.FC = () => {
  const { username, setUsername, gameoverData } = useGameContext();

  const navigate = useNavigate();
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<onlineUsersType[]>([]);
  const [requestReceived, setRequestReceived] = useState<
    {
      fromUsername: string;
      fromSocketId: string;
    }[]
  >([]);

  useEffect(() => {
    if (username) {
      setIsUserRegistered(true);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      socket.emit("getonlineUsers");
    }

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("gameRequest", ({ fromUsername, fromSocketId }) => {
      setRequestReceived((prevState) => {
        // Check if the fromSocketId is already in the array
        const isDuplicate = prevState.some(
          (request) => request.fromSocketId === fromSocketId
        );
        if (!isDuplicate) {
          return [...prevState, { fromUsername, fromSocketId }];
        }
        return prevState;
      });
    });

    socket.on("requestDeclined", ({ username }) => {
      toastMessage(`Request declined by ${username}`);
    });

    socket.on("requestAccepted", ({ room }) => {
      navigate(`/game/${room}`);
    });

    socket.on("registrationError", ({ message }) => {
      toastMessage(message);
    });

    socket.on("acceptRequestError", ({ message, opponentSocketId }) => {
      toastMessage(message);
      setRequestReceived((prevRequests) =>
        prevRequests.filter(
          (request) => request.fromSocketId !== opponentSocketId
        )
      );
    });

    socket.on("registeredSuccess", ({ message }) => {
      toastMessage(message);
      setIsUserRegistered(true);
      setUsername(text);
    });

    return () => {
      socket.off("acceptRequestError");
      socket.off("requestDeclined");
      socket.off("getonlineUsers");
      socket.off("registeredSuccess");
      socket.off("registrationError");
      socket.off("onlineUsers");
      socket.off("gameRequest");
      socket.off("requestAccepted");
    };
  }, [navigate, setUsername, text]);

  const registerUser = (e: FormEvent) => {
    e.preventDefault();
    socket.emit("register", { username: text });
  };

  const sendRequest = (toSocketId: string) => {
    socket.emit("sendRequest", { toSocketId, fromUsername: text });
    toastMessage("Request Sent");
  };

  const acceptRequest = (socketId: string) => {
    if (requestReceived) {
      const room = `${socket.id}-${socketId}`;
      socket.emit("acceptRequest", {
        fromSocketId: socketId,
        room,
      });
    }
  };

  const declineRequest = (socketId: string) => {
    if (requestReceived) {
      socket.emit("declineRequest", {
        fromSocketId: socketId,
        username: text,
      });
      setRequestReceived((prevRequests) =>
        prevRequests.filter((request) => request.fromSocketId !== socketId)
      );
    }
  };

  const toastMessage = (msg: string, icon?: string) => {
    toast(msg, {
      duration: 1500,
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
    <Layout
      title="Cricket Card Game | Multiplayer Fun"
      description="Join the ultimate cricket card game! Play with friends, compare stats of cricket legends like Sachin Tendulkar and Virat Kohli, and enjoy a fun, competitive multiplayer experience. Challenge your friends, climb the leaderboard, and become the cricket card champion."
      keywords="cricket card game, multiplayer cricket game, online cricket game, cricket stats game, cricket cards, cricket game with friends, cricket trivia, cricket players cards, cricket strategy game, fun cricket game, cricket fans, best cricket games, cricket card game rules, cricket game app, childhood cricket games, cricket trading cards, top cricket players, cricket card tournament, cricket sports card, online sports games, cricket enthusiasts, play cricket card game, cricket card deck, cricket board game, cricket mobile game, cricket stats, cricket player comparison, cricket fun games, cricket games online, cricket game download, free cricket game, cricket card game play, cricket card game online, cricket card game multiplayer, cricket card game app, cricket game with friends, competitive cricket game, cricket card game strategy, cricket card game tips, best cricket card game, ultimate cricket card game, cricket game experience, cricket game for kids, family cricket game, cricket game for all ages, cricket card game history, cricket card game facts, cricket card game fun, cricket card game challenge, cricket leaderboard, cricket legends game, cricket multiplayer experience, competitive cricket card game, cricket card battle, cricket champion, cricket card duel, cricket card collection, cricket card showdown"
      author="Sudhanshu"
      type="website"
      url="https://cricketcard.live"
      image="https://www.cricketcardgame.site/assets/cricket_card_game.jpg"
    >
      {!gameoverData && (
        <section className="home">
          {isUserRegistered ? (
            <div className="home-onlineusers">
              <h2>Online Users</h2>
              <ul>
                {onlineUsers.map((user) => (
                  <li key={user.socketId}>
                    <p>{user.username}</p>
                    {socket.id !== user.socketId ? (
                      user.status === "notplaying" ? (
                        <button
                          className="game-request"
                          onClick={() => sendRequest(user.socketId)}
                        >
                          Game Request
                        </button>
                      ) : (
                        <button className="in-match">In Match</button>
                      )
                    ) : (
                      <button className="you">You</button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="home-register">
              <form onSubmit={registerUser}>
                <label htmlFor="">Username</label>
                <input
                  required
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your username"
                />
                <button type="submit">Enter</button>
              </form>
            </div>
          )}
          {requestReceived.length > 0 && (
            <div className="home-gamerequest">
              {requestReceived.map((item, index) => (
                <div key={index} className="item">
                  <p>{item.fromUsername} wants to play with you</p>
                  <button
                    className="accept"
                    onClick={() => acceptRequest(item.fromSocketId)}
                  >
                    Accept
                  </button>
                  <button
                    className="decline"
                    onClick={() => declineRequest(item.fromSocketId)}
                  >
                    Decline
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      {!isUserRegistered && (
        <React.Fragment>
          <Introduction />
          <Footer />
        </React.Fragment>
      )}
    </Layout>
  );
};

export default Home;
