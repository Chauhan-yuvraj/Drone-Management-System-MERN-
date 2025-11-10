import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Landing from "./Pages/Landing";
import Signup from "./Pages/Signup";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
