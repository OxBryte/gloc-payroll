import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Workspace from "./pages/Workspace";
import Overview from "./components/features/workspace/Overview";
import Employees from "./components/features/workspace/Employees";
import Payroll from "./components/features/workspace/Payroll";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/workspace/:slug" element={<Workspace />} />
            <Route path="/workspace/:slug/:id" element={<Workspace />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/:id" element={<h1>Dynamic Route</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
