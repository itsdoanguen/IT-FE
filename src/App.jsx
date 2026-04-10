import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Dangtintuyendung/Dangtintuyendung';
import Manhinhmatching from './pages/Manhinhmatching/Manhinhmatching';
import Timkiemcongviec from './pages/Timkiemcongviec/Timkiemcongviec';
import Danhsachtuyendung from './pages/Danhsachtuyendung/Danhsachtuyendung';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recruitments" element={<Danhsachtuyendung />} />
        <Route path="/matching" element={<Manhinhmatching />} />
        <Route path="/search" element={<Timkiemcongviec />} />
      </Routes>
    </Router>
  );
}

export default App;
