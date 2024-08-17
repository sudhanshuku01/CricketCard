import express from "express";
import http from "http";
import * as dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";

import { cricketerNames, CricketerData } from "./utils/Cricketer.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

const PORT = 8000;

let onlineUsers = {};
let games = {};

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server started");
});

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("register", ({ username }) => {
    const existingUser = Object.values(onlineUsers).find(
      (user) => user.username === username
    );

    if (existingUser) {
      io.to(socket.id).emit("registrationError", {
        message: "Username is already exists",
      });
      return;
    }
    onlineUsers[socket.id] = {
      username,
      socketId: socket.id,
      status: "notplaying",
    };
    io.to(socket.id).emit("registeredSuccess", {
      message: "Registered Successfully",
    });
    io.emit("onlineUsers", Object.values(onlineUsers));
  });

  socket.on("getonlineUsers", () => {
    io.emit("onlineUsers", Object.values(onlineUsers));
  });

  socket.on("disconnect", () => {
    const user = onlineUsers[socket.id];
    if (user) {
      if (user.status === "notplaying") {
        delete onlineUsers[socket.id];
        io.emit("onlineUsers", Object.values(onlineUsers));
        console.log("user disconnect", socket.id);
        return;
      }

      const userRoom = Object.keys(games).find(
        (room) =>
          games[room].player1 === socket.id || games[room].player2 === socket.id
      );

      if (userRoom) {
        const game = games[userRoom];
        const opponentSocketId =
          game.player1 === socket.id ? game.player2 : game.player1;

        io.to(opponentSocketId).emit("opponentLeft", {
          message: `${user.username} has left the game`,
        });

        delete games[userRoom];

        if (onlineUsers[opponentSocketId]) {
          onlineUsers[opponentSocketId].status = "notplaying";
        }
      }

      delete onlineUsers[socket.id];
      io.emit("onlineUsers", Object.values(onlineUsers));
    }

    console.log("user disconnected", socket.id);
  });

  socket.on("userLeft", ({ room, username }) => {
    const game = games[room];
    if (game) {
      let opponentSocketId = "";
      if (socket.id === game.player1) {
        opponentSocketId = game.player2;
      } else if (socket.id === game.player2) {
        opponentSocketId = game.player1;
      }

      io.to(opponentSocketId).emit("opponentLeft", {
        message: `${username} has left the game, you got 1000 points`,
      });

      delete games[room];
      if (onlineUsers[socket.id]) {
        onlineUsers[socket.id].status = "notplaying";
      }
      if (onlineUsers[opponentSocketId]) {
        onlineUsers[opponentSocketId].status = "notplaying";
      }

      io.emit("onlineUsers", Object.values(onlineUsers));
    }
  });

  socket.on("sendRequest", ({ toSocketId, fromUsername }) => {
    io.to(toSocketId).emit("gameRequest", {
      fromUsername,
      fromSocketId: socket.id,
    });
  });

  socket.on("declineRequest", ({ fromSocketId, username }) => {
    io.to(fromSocketId).emit("requestDeclined", {
      username,
    });
  });

  socket.on("acceptRequest", ({ fromSocketId, room }) => {
    const user = onlineUsers[fromSocketId];

    if (!user) {
      io.to(socket.id).emit("acceptRequestError", {
        opponentSocketId: fromSocketId,
        message: `User is offine now`,
      });
      return;
    }

    if (user.status === "playing") {
      io.to(socket.id).emit("acceptRequestError", {
        message: `${user.username} joined anotherGame`,
        opponentSocketId: fromSocketId,
      });
      return;
    }

    socket.join(room);
    const shuffled = cricketerNames.sort(() => Math.random() - 0.5);
    const midpoint = Math.floor(shuffled.length / 2);

    games[room] = {
      player1: socket.id,
      player2: fromSocketId,
      player1Cards: shuffled.slice(0, midpoint),
      player2Cards: shuffled.slice(midpoint),
      player1Points: 0,
      player2Points: 0,
      currentPlayer: 1,
    };

    io.to(fromSocketId).emit("requestAccepted", { room });
    io.to(socket.id).emit("requestAccepted", { room });

    onlineUsers[socket.id].status = "playing";
    onlineUsers[fromSocketId].status = "playing";

    io.emit("onlineUsers", Object.values(onlineUsers));
  });

  socket.on("requestgamestate", ({ room }) => {
    const existingroom = games[room];
    if (!existingroom) {
      console.log("no room found-------");
      return;
    }

    // game over conditions
    if (existingroom.player1Cards.length < 1) {
      onlineUsers[existingroom.player1].status = "notplaying";
      onlineUsers[existingroom.player2].status = "notplaying";

      io.to(existingroom.player1).emit("gameover", {
        yourScore: existingroom.player1Points,
        yourOpponentScore: existingroom.player2Points,
      });
      io.to(existingroom.player2).emit("gameover", {
        yourScore: existingroom.player2Points,
        yourOpponentScore: existingroom.player1Points,
      });

      delete games[room];
      return;
    }

    if (socket.id === existingroom.player1) {
      io.to(existingroom.player1).emit("getgamestate", {
        yourCardName: existingroom.player1Cards[0],
        yourTurn: existingroom.currentPlayer === 1,
        yourScore: existingroom.player1Points,
        opponentScore: existingroom.player2Points,
        cardLeft: existingroom.player1Cards.length,
      });
    } else if (socket.id === existingroom.player2) {
      io.to(existingroom.player2).emit("getgamestate", {
        yourCardName: existingroom.player2Cards[0],
        yourTurn: existingroom.currentPlayer === 2,
        yourScore: existingroom.player2Points,
        opponentScore: existingroom.player1Points,
        cardLeft: existingroom.player2Cards.length,
      });
    }
  });

  socket.on("bet", ({ attribute, room }) => {
    const game = games[room];

    if (!game) return;

    const player1CardName = game.player1Cards[0];
    const player2CardName = game.player2Cards[0];
    const player1Card = CricketerData[player1CardName];
    const player2Card = CricketerData[player2CardName];

    let player1Wins = false;

    switch (attribute) {
      case "match":
        player1Wins = player1Card.odi.match > player2Card.odi.match;
        break;
      case "run":
        player1Wins = player1Card.odi.run > player2Card.odi.run;
        break;
      case "average":
        player1Wins = player1Card.odi.average > player2Card.odi.average;
        break;
      case "notout":
        player1Wins = player1Card.odi.notout > player2Card.odi.notout;
        break;
      case "highest":
        player1Wins = player1Card.odi.highest > player2Card.odi.highest;
        break;
      case "100s":
        player1Wins = player1Card.odi["100s"] > player2Card.odi["100s"];
        break;
      case "50s":
        player1Wins = player1Card.odi["50s"] > player2Card.odi["50s"];
        break;
      case "wicket":
        player1Wins = player1Card.odi.wicket > player2Card.odi.wicket;
        break;
      case "catch":
        player1Wins = player1Card.odi.catch > player2Card.odi.catch;
        break;
      case "ball":
        player1Wins = player1Card.odi.ball > player2Card.odi.ball;
        break;
      default:
        console.log("Unknown attribute");
    }

    if (player1Wins) {
      game.player1Points += 1;
      game.currentPlayer = 1;
    } else {
      game.player2Points += 1;
      game.currentPlayer = 2;
    }

    if (game.player1 === socket.id) {
      io.to(game.player1).emit("betresult", {
        betAttribute: `you made bet on ${attribute}`,
        resultMessage: player1Wins
          ? "Congratulations! You won this bet"
          : "Oh no! You lost this bet",
        OpponentBetCardName: game.player2Cards[0],
      });
      io.to(game.player2).emit("betresult", {
        betAttribute: `your opponent made bet on ${attribute}`,
        resultMessage: player1Wins
          ? "Oh no! You lost this bet"
          : "Congratulations! You won this bet",
        OpponentBetCardName: game.player1Cards[0],
      });
    } else {
      io.to(game.player2).emit("betresult", {
        betAttribute: `you made bet on ${attribute}`,
        resultMessage: player1Wins
          ? "Ohh! you loss this bet"
          : "Congrates you won the this bet",
        OpponentBetCardName: game.player1Cards[0],
      });
      io.to(game.player1).emit("betresult", {
        betAttribute: `your opponent made bet on ${attribute}`,
        resultMessage: player1Wins
          ? "Congratulations! You won this bet."
          : "Oh no! You lost this bet.",
        OpponentBetCardName: game.player2Cards[0],
      });
    }

    game.player1Cards = game.player1Cards.slice(1);

    game.player2Cards = game.player2Cards.slice(1);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
