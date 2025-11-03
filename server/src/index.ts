import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Parse JSON request body
app.use(express.json());
app.use(bodyParser.json());

// ✅ Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
 ✅ ✅ ✅ FINAL QR ATTENDANCE ROUTE (ROLL → UUID SAFE) ✅ ✅ ✅
------------------------------------------------------------------- */

app.get('/api/qr-attendance', async (req, res) => {
  try {
    const rawStudent = (req.query.student_id || '').toString().trim(); // roll number
    const rawSession = (req.query.session_id || '').toString().trim(); // session number

    if (!rawStudent || !rawSession) {
      return res.status(400).send('Missing student_id or session_id');
    }

    // ✅ 1) Check student by roll number (student_id column)
    const { data: studentRow, error: studentErr } = await supabase
      .from('students')
      .select('id')
      .eq('student_id', rawStudent)
      .limit(1)
      .single();

    if (studentErr || !studentRow || !studentRow.id) {
      return res.status(404).send('Student not found. Add the student to the students table.');
    }

    const studentUuid = studentRow.id;

    // ✅ 2) Prevent double attendance
    const { data: existing } = await supabase
      .from('attendance_records')
      .select('id')
      .eq('student_id', studentUuid)
      .eq('session_id', rawSession)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.send('Attendance already marked for this session.');
    }

    // ✅ 3) Insert attendance
    const { error: insertErr } = await supabase
      .from('attendance_records')
      .insert([{
        student_id: studentUuid,
        session_id: rawSession,
        status: 'present',
        method: 'qr'
      }]);

    if (insertErr) {
      console.error('Insert error:', insertErr);
      return res.status(500).send('Error marking attendance');
    }

    return res.send('Attendance marked successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
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
