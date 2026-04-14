import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Dangtintuyendung from "./pages/Dangtintuyendung/Dangtintuyendung";
import Manhinhmatching from "./pages/Manhinhmatching/Manhinhmatching";
import Timkiemcongviec from "./pages/Timkiemcongviec/Timkiemcongviec";
import Danhsachtuyendung from "./pages/Danhsachtuyendung/Danhsachtuyendung";
import Chitiettuyendung from "./pages/Chitiettuyendung/Chitiettuyendung";
import Quanlyungvien from "./pages/Quanlyungvien/Quanlyungvien";
import Chitiethosoungvien from "./pages/Chitiethosoungvien/Chitiethosoungvien";
import Header from "./components/Header";
import { getTestToken, setAuthToken } from "./services/api";
import "./app.css";

function App() {
  const [role, setRole] = useState("guest");

  useEffect(() => {
    // Initialize test token on app startup for demo mode
    async function initializeTestToken() {
      const token = await getTestToken();
      if (token) {
        setAuthToken(token);
      }
    }

    initializeTestToken();
  }, []);

  return (
    <Router>
      <div className="app-shell">
        <Header role={role} onRoleChange={setRole} />
        <main className="app-content">
          <Routes>
            <Route path="/Dangtintuyendung" element={<Dangtintuyendung />} />
            <Route path="/recruitments" element={<Danhsachtuyendung />} />
            <Route path="/matching" element={<Manhinhmatching />} />
            <Route path="/search" element={<Timkiemcongviec />} />
            <Route path="/candidates" element={<Quanlyungvien />} />
            <Route path="/candidates/:id" element={<Chitiethosoungvien />} />
            <Route path="/Chitiettuyendung/temp" element={<Chitiettuyendung />} />
            <Route path="/chitiettuyendung" element={<Chitiettuyendung />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
