import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Workspace from "./pages/Workspace";
import SingleWorkspace from "./pages/SingleWorkspace";
import CreatePayroll from "./pages/CreatePayroll";
import AuthLayout from "./components/layouts/AuthLayout";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ProtectedRoute from "./ProtectedRoute";
import AcceptAdmin from "./pages/AcceptAdmin";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Subscriptions from "./pages/Subscriptions";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Careers from "./pages/Careers";
import Apply from "./pages/Apply";
import InvoicePage from "./pages/InvoicePage";
import Tasks from "./pages/Tasks";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/workspace" element={<Workspace />} />
              <Route path="/workspace/:slug" element={<SingleWorkspace />} />
              <Route
                path="/workspace/:slug/:id"
                element={<SingleWorkspace />}
              />
              <Route
                path="/workspace/:slug/:id/invoice"
                element={<InvoicePage />}
              />
              <Route
                path="/workspace/:slug/payroll/create"
                element={<CreatePayroll />}
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="/subscription" element={<Subscriptions />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/jobs/:id/apply" element={<Apply />} />
            </Route>
          </Route>
          <Route path="/careers" element={<Careers />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
          <Route path="/reset-password/" element={<ResetPassword />} />
          <Route path="/accept-admin" element={<AcceptAdmin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
