"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_js_1 = require("@supabase/supabase-js");
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// ✅ Enable CORS
app.use((0, cors_1.default)());
// ✅ Parse JSON request body
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
// ✅ Supabase client
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
/* ------------------------------------------------------------------
   ✅ API ROUTES
------------------------------------------------------------------- */
/**
 * ✅ GET /api/students
 * Returns all students
 */
app.get('/api/students', async (req, res) => {
    const { data, error } = await supabase.from('students').select('*');
    if (error) {
        console.error("Supabase Error:", error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});
/**
 * ✅ POST /api/attendance
 * Insert attendance for a student
 */
app.post('/api/attendance', async (req, res) => {
    const { student_id, session_id, status, method } = req.body;
    const { data, error } = await supabase
        .from('attendance_records')
        .insert([{ student_id, session_id, status, method }]);
    if (error) {
        console.error("Insert Error:", error);
        return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Attendance marked successfully', data });
});
/**
 * ✅ GET /api/attendance
 * Fetch all attendance records
 */
app.get('/api/attendance', async (req, res) => {
    const { data, error } = await supabase
        .from('attendance_records')
        .select('*');
    if (error) {
        console.error("Attendance Fetch Error:", error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});
/* ------------------------------------------------------------------
 ✅ ✅ ✅ QR ATTENDANCE ROUTE — UUID SAFE + NO DUPLICATES ✅ ✅ ✅
------------------------------------------------------------------- */
app.get('/api/qr-attendance', async (req, res) => {
    const { student_id, session_id } = req.query;
    if (!student_id || !session_id) {
        return res.status(400).send("Missing student_id or session_id");
    }
    // ✅ student_id stays as string (UUID)
    const sid = String(student_id);
    // ✅ session_id must be a NUMBER (because your DB column is int8)
    const sess = Number(session_id);
    if (isNaN(sess)) {
        return res.status(400).send("Invalid session_id (must be a number)");
    }
    // ✅ 1. Check if attendance already exists
    const { data: existing, error: checkError } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('student_id', sid)
        .eq('session_id', sess);
    if (checkError) {
        console.error("Check Error:", checkError);
        return res.status(500).send("Database check failed");
    }
    if (existing.length > 0) {
        return res.send("⚠️ Attendance already marked for this session.");
    }
    // ✅ 2. Insert new attendance
    const { error } = await supabase
        .from('attendance_records')
        .insert([{
            student_id: sid,
            session_id: sess,
            status: "present",
            method: "qr"
        }]);
    if (error) {
        console.error("Insert Error:", error);
        return res.status(500).send("Error marking attendance");
    }
    return res.send("✅ Attendance Marked Successfully!");
});
/* ------------------------------------------------------------------
   ✅ CLASS REPORT
------------------------------------------------------------------- */
app.get('/api/reports/class/:classId', async (req, res) => {
    const classId = req.params.classId;
    const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('class_id', classId);
    if (error) {
        console.error("Class Report Error:", error);
        return res.status(500).json({ error: error.message });
    }
    res.json({ data });
});
/* ------------------------------------------------------------------
 ✅ STUDENT REPORT
------------------------------------------------------------------- */
app.get('/api/reports/student/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
    const { data, error } = await supabase
        .from('attendance_records')
        .select('session_id, marked_at, status, method')
        .eq('student_id', studentId)
        .order('marked_at', { ascending: false });
    if (error) {
        console.error("Student Report Error:", error);
        return res.status(500).json({ error: error.message });
    }
    res.json({ data });
});
/* ------------------------------------------------------------------
   ✅ HEALTH CHECK ENDPOINT
------------------------------------------------------------------- */
app.get("/", (req, res) => {
    res.send("Attendance backend running ✅");
});
/* ------------------------------------------------------------------
   ✅ START SERVER
------------------------------------------------------------------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Attendance backend running on port ${PORT}`);
});
