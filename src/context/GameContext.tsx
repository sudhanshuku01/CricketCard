import React, { createContext, useContext, useState, ReactNode } from "react";

interface GameContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  gameoverData: {
    yourScore: number;
    yourOpponentScore: number;
    message: string;
  } | null;
  setGameoverData: React.Dispatch<
    React.SetStateAction<{
      yourScore: number;
      yourOpponentScore: number;
      message: string;
    } | null>
  >;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Create a provider component
export const GameoverProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState("");
  const [points, setPoints] = useState(0);

  const [gameoverData, setGameoverData] = useState<{
    yourScore: number;
    yourOpponentScore: number;
    message: string;
  } | null>(null);

  return (
    <GameContext.Provider
      value={{
        username,
        setUsername,
        points,
        setPoints,
        gameoverData,
        setGameoverData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Create a custom hook to use the context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error(
      "useGameoverContext must be used within a GameoverProvider"
    );
  }
  return context;
};
