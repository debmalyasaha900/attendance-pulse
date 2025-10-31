-- 001_create_schema.sql
-- Smart Attendance System: tables, constraints and indexes

-- Enable uuid-ossp if needed (Supabase provides gen_random_uuid via pgcrypto; adapt if necessary)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (common for students & faculty)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student','faculty','admin')),
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Students details (one-to-one to users where role='student')
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  roll_no text UNIQUE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  year smallint,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Faculty table (one-to-one to users where role='faculty')
CREATE TABLE IF NOT EXISTS faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  faculty_id uuid REFERENCES faculty(id) ON DELETE SET NULL,
  semester smallint,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Class sessions (a scheduled lecture / lab instance)
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  location text, -- optional room or geofence label
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- QR sessions: active QR codes created for a session
CREATE TABLE IF NOT EXISTS qr_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  qr_token text NOT NULL UNIQUE,  -- a short token embedded in QR code
  generated_by uuid REFERENCES users(id),
  generated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'
);

-- Attendance records
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  marked_by uuid REFERENCES users(id), -- who marked it; when student self-marks this may be the same or null
  marked_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL CHECK (status IN ('present','absent','late','excused')),
  method text NOT NULL CHECK (method IN ('qr','manual','auto')), -- how it was marked
  location_point geography(POINT,4326), -- optional lat,long if verifying GPS (requires PostGIS)
  metadata jsonb DEFAULT '{}',
  UNIQUE(session_id, student_id)
);

-- Indexes / performance
CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance_records(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_qrsession_session ON qr_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_course ON sessions(course_id);
