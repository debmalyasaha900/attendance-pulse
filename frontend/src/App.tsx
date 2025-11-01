import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Teacher from "./pages/Teacher";
import Student from "./pages/Student";
import ScanQR from "./pages/scanqr";
import Analytics from "./pages/Analytics";
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

        {/* ✅ Scan QR page */}
        <Route path="/scanqr" element={<ScanQR />} />

        {/* ✅ Analytics Dashboard page */}
        <Route path="/analytics" element={<Analytics />} />

        {/* ✅ 404 Catch-all */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
