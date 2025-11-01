// frontend/src/integrations/supabase/api.ts

// ✅ Use Vercel / local environment variable
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// ✅ Fetch all students
export async function getStudents() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/students`);
    if (!res.ok) throw new Error("Failed to fetch students");

    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    return [];
  }
}

// ✅ Fetch all attendance records
export async function getAttendance() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/attendance`);
    if (!res.ok) throw new Error("Failed to fetch attendance");

    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching attendance:", err);
    return [];
  }
}

// ✅ Fetch attendance for a specific student
export async function getAttendanceByStudent(studentId: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/attendance?student_id=${studentId}`
    );

    if (!res.ok) throw new Error("Failed to fetch student attendance");

    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching student attendance:", err);
    return [];
  }
}
