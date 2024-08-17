import "./style/App.css";
import Game from "./components/general/Game";

import Home from "./components/general/Home";
import { Routes, Route } from "react-router-dom";
import About from "./components/general/About";
import PrivacyPolicy from "./components/general/PrivacyPolicy";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:room" element={<Game />} />
      <Route path="/about" element={<About />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
  );
};

export default App;
