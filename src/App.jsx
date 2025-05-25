import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Workspace from "./pages/Workspace";
import SingleWorkspace from "./pages/SingleWorkspace";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/workspace/:slug" element={<SingleWorkspace />} />
            <Route path="/workspace/:slug/:id" element={<SingleWorkspace />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/:id" element={<h1>Dynamic Route</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
