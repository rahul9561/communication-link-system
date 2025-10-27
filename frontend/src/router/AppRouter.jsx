import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Links from "../pages/Links";
import Logs from "../pages/Logs";
import Settings from "../pages/Settings";
import Analytics from "../pages/Analytics";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/links" element={<Links />} />
    <Route path="/analytics" element={<Analytics />} />
    <Route path="/logs" element={<Logs />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="*" element={<NotFound />} />
  
  </Routes>
);

export default AppRouter;