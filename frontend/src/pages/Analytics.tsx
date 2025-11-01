import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, TrendingUp, Users, Calendar, Award } from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { getAttendance, getStudents } from "../integrations/supabase/api";

const Analytics = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Supabase data
  useEffect(() => {
    async function load() {
      setLoading(true);
      const stu = await getStudents();
      const att = await getAttendance();

      setStudents(stu || []);
      setAttendance(att || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-xl font-semibold">
        Loading Analytics...
      </div>
    );
  }

  // ✅ Total Students
  const totalStudents = students.length;

  // ✅ Attendance Today
  const today = new Date().toISOString().split("T")[0];
  const attendanceToday = attendance.filter((a) =>
    a.created_at.startsWith(today)
  ).length;

  // ✅ Attendance Trend — grouped by date
  const attendanceTrendObj = attendance.reduce((acc: any, item: any) => {
    const date = item.created_at.split("T")[0];
    acc[date] = acc[date] || { date, attendance: 0 };
    acc[date].attendance += 1;
    return acc;
  }, {});

  const attendanceTrend = Object.values(attendanceTrendObj);

  // ✅ Subject-wise attendance
  const subjectAttendanceObj = attendance.reduce((acc: any, item: any) => {
    const subject = item.subject || "Unknown";
    acc[subject] = acc[subject] || { subject, attendance: 0 };
    acc[subject].attendance += 1;
    return acc;
  }, {});

  const subjectAttendance = Object.values(subjectAttendanceObj);

  // ✅ Attendance Distribution
  const studentAttendanceMap: any = {};

  attendance.forEach((a: any) => {
    studentAttendanceMap[a.student_id] =
      (studentAttendanceMap[a.student_id] || 0) + 1;
  });

  const attendanceDistribution = [
    {
      name: "Excellent (90-100%)",
      value: Object.values(studentAttendanceMap).filter((v: any) => v >= 9)
        .length,
      color: "#22c55e",
    },
    {
      name: "Good (75-89%)",
      value: Object.values(studentAttendanceMap).filter(
        (v: any) => v >= 7 && v < 9
      ).length,
      color: "#14b8a6",
    },
    {
      name: "Average (60-74%)",
      value: Object.values(studentAttendanceMap).filter(
        (v: any) => v >= 6 && v < 7
      ).length,
      color: "#f59e0b",
    },
    {
      name: "Poor (<60%)",
      value: Object.values(studentAttendanceMap).filter((v: any) => v < 6)
        .length,
      color: "#ef4444",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Real-time attendance insights
        </p>

        {/* ✅ Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6 shadow-lg bg-gradient-card">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Students
                </p>
                <p className="text-3xl font-bold">{totalStudents}</p>
              </div>
              <Users className="w-12 h-12 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 shadow-lg bg-gradient-card">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Attendance Today
                </p>
                <p className="text-3xl font-bold">{attendanceToday}</p>
              </div>
              <Calendar className="w-12 h-12 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 shadow-lg bg-gradient-card">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Subjects Active
                </p>
                <p className="text-3xl font-bold">{subjectAttendance.length}</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 shadow-lg bg-gradient-card">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Top Performer
                </p>
                <p className="text-3xl font-bold">Automatically Calculated</p>
              </div>
              <Award className="w-12 h-12 opacity-20" />
            </div>
          </Card>
        </div>

        {/* ✅ Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* ✅ Attendance Trend */}
          <Card className="p-6 shadow-lg bg-gradient-card">
            <h2 className="text-xl font-semibold mb-4">
              Attendance Trend (Supabase)
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#4f46e5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* ✅ Subject-wise Attendance */}
          <Card className="p-6 shadow-lg bg-gradient-card">
            <h2 className="text-xl font-semibold mb-4">
              Subject-wise Attendance
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendance" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* ✅ Distribution Pie Chart */}
        <Card className="p-6 shadow-lg bg-gradient-card">
          <h2 className="text-xl font-semibold mb-4">
            Attendance Distribution
          </h2>

          <div className="flex flex-col md:flex-row justify-around items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                  dataKey="value"
                >
                  {attendanceDistribution.map((item, index) => (
                    <Cell key={index} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 md:mt-0 space-y-2">
              {attendanceDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
