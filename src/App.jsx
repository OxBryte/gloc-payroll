import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Dice from "./pages/Dice";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dice" element={<Dice />} />
            <Route path="/about" element={<h1>About</h1>} />
            <Route path="/plinko" element={<h1>Plinko</h1>} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
            <Route path="/:id" element={<h1>Dynamic Route</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
