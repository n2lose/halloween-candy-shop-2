import { Routes, Route, Navigate } from "react-router-dom";

// Routes filled in PLAN-008 through PLAN-011
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
