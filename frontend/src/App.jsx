import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Reels from "./pages/Reels";
import Explore1 from "./pages/Explore1";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore1" element={<Explore1 />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;