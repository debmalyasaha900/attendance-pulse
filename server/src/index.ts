import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import { z } from 'zod';
import crypto from 'crypto';

dotenv.config();

const SERVICE_URL = process.env.SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Keep secret, server-only
if (!SERVICE_URL || !SERVICE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(SERVICE_URL, SERVICE_KEY, { auth: { persistSession: false } });
const app = express();
app.use(express.json());

/**
 * Utility: make a short random token (not super long)
 */
function makeToken(len = 12) {
    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
}

/**
 * POST /api/sessions/create
 * Body: { session_id: string, expires_in_minutes?: number, generated_by?: uuid }
 * Response: { qr_token, qr_data_url, expires_at }
 */
app.post('/api/sessions/create', async (req, res) => {
    const bodySchema = z.object({
        session_id: z.string().uuid(),
        expires_in_minutes: z.number().int().positive().optional().default(5),
        generated_by: z.string().uuid().optional()
    });
    const parse = bodySchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.format() });

    const { session_id, expires_in_minutes, generated_by } = parse.data;
    const token = makeToken(10);
    const generatedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + expires_in_minutes * 60000).toISOString();

    // Insert into qr_sessions
    const { data, error } = await supabase
        .from('qr_sessions')
        .insert([{
            session_id,
            qr_token: token,
            generated_by,
            generated_at: generatedAt,
            expires_at: expiresAt,
            is_active: true
        }])
        .select()
        .single();

    if (error) {
        console.error('Failed to create qr_session', error);
        return res.status(500).json({ error: error.message });
    }

    // QR payload could be simply the token + server url; frontend will encode it.
    const qrPayload = JSON.stringify({ t: token, s: session_id });

    const qrDataUrl = await QRCode.toDataURL(qrPayload);

    res.json({ qr_token: token, expires_at: expiresAt, qr_data_url: qrDataUrl });
});

/**
 * POST /api/attendance/mark
 * Body: { qr_token: string, student_user_id: uuid, method?: 'qr'|'manual', lat?: number, lng?: number }
 * - Finds active qr_session by token, ensures not expired, gets session_id and marks attendance_records
 */
app.post('/api/attendance/mark', async (req, res) => {
    const schema = z.object({
        qr_token: z.string().min(1),
        student_user_id: z.string().uuid(),
        method: z.enum(['qr', 'manual', 'auto']).optional().default('qr'),
        lat: z.number().optional(),
        lng: z.number().optional()
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.format() });

    const { qr_token, student_user_id, method, lat, lng } = parsed.data;

    // 1) Get active QR session
    const { data: qr, error: qrErr } = await supabase
        .from('qr_sessions')
        .select('*')
        .eq('qr_token', qr_token)
        .eq('is_active', true)
        .lte('generated_at', new Date().toISOString())-- no-op but kept
            .single();

    if (qrErr || !qr) {
        return res.status(404).json({ error: 'Invalid or expired QR token' });
    }

    const expiresAt = new Date(qr.expires_at);
    if (expiresAt.getTime() < Date.now()) {
        // deactivate
        await supabase.from('qr_sessions').update({ is_active: false }).eq('id', qr.id);
        return res.status(410).json({ error: 'QR token expired' });
    }

    // 2) Resolve student -> students.id using users table
    const { data: studentRow, error: studentErr } = await supabase
        .from('students')
        .select('id,user_id')
        .eq('user_id', student_user_id)
        .single();

    if (studentErr || !studentRow) {
        return res.status(404).json({ error: 'Student record not found' });
    }

    const studentId = studentRow.id;
    const sessionId = qr.session_id;

    // 3) Insert attendance_records (upsert to avoid duplicates)
    // Build insert object
    const attendanceObj: any = {
        session_id: sessionId,
        student_id: studentId,
        marked_by: null,
        status: 'present',
        method,
        metadata: { source: 'qr' }
    };
    if (lat !== undefined && lng !== undefined) {
        // store as text in metadata if PostGIS is not enabled; if PostGIS enabled, use proper geography insertion via SQL
        attendanceObj.metadata.location = { lat, lng };
    }

    // Use upsert (on conflict (session_id, student_id) do update set marked_at=..., status=...)
    const { data: inserted, error: insertErr } = await supabase
        .from('attendance_records')
        .upsert(
            [{
                session_id: sessionId,
                student_id: studentId,
                marked_by: null,
                status: 'present',
                method,
                metadata: attendanceObj.metadata
            }],
            { onConflict: ['session_id', 'student_id'] }
        )
        .select()
        .single();

    if (insertErr) {
        console.error('Attendance insert failed', insertErr);
        return res.status(500).json({ error: insertErr.message });
    }

    res.json({ success: true, attendance: inserted });
});

/**
 * GET /api/attendance/session/:sessionId
 * Returns attendance for a session
 */
app.get('/api/attendance/session/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    const { data, error } = await supabase
        .from('attendance_records')
        .select('*, students(user_id, roll_no), students:user_id->users(name,email)')
        .eq('session_id', sessionId);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ data });
});

/**
 * GET /api/reports/student/:studentId
 * Returns attendance summary for a student
 */
app.get('/api/reports/student/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
    const { data, error } = await supabase
        .from('attendance_records')
        .select('session_id,marked_at,status,method')
        .eq('student_id', studentId)
        .order('marked_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ data });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Attendance backend running on port ${PORT}`);
});
