import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Teacher from "./pages/Teacher";
import Student from "./pages/Student";
import ScanQR from "./pages/scanqr";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>

        {/* ✅ Home page */}
        <Route path="/" element={<Index />} />

        {/* ✅ Teacher page */}
        <Route path="/teacher" element={<Teacher />} />

        {/* ✅ Student page */}
        <Route path="/student" element={<Student />} />

        {/* ✅ Scan QR page (camera opens here) */}
        <Route path="/scanqr" element={<ScanQR />} />

        {/* ✅ Catch all unknown routes */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
