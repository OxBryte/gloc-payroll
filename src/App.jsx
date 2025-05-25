import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/:id" element={<h1>Dynamic Route</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
