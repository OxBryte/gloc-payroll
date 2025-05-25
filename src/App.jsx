import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Workspace from "./pages/Workspace";
import SingleWorkspace from "./pages/SingleWorkspace";
import { useEffect, useState } from "react";

function App() {
  const NavigationLoader = () => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }, [location.pathname]);

    if (isLoading) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-c-bg backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <BrowserRouter>
        {/* <NavigationLoader /> */}
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
