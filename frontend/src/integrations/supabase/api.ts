export const API_BASE_URL = "http://localhost:8080";

export async function getStudents() {
  console.log("Fetching students...");
  const res = await fetch(`${API_BASE_URL}/api/students`);
  const data = await res.json();
  console.log("Students:", data);
  return data;
}

export async function getAttendance() {
  console.log("Fetching attendance...");
  const res = await fetch(`${API_BASE_URL}/api/attendance`);
  const data = await res.json();
  console.log("Attendance:", data);
  return data;
}
