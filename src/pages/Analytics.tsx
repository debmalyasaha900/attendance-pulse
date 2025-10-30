import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const Analytics = () => {
  const navigate = useNavigate();

  const attendanceTrend = [
    { date: "Jan 22", attendance: 85 },
    { date: "Jan 23", attendance: 88 },
    { date: "Jan 24", attendance: 82 },
    { date: "Jan 25", attendance: 90 },
    { date: "Jan 26", attendance: 87 },
    { date: "Jan 27", attendance: 91 },
    { date: "Jan 28", attendance: 89 },
  ];

  const subjectAttendance = [
    { subject: "Data Structures", attendance: 92 },
    { subject: "Web Dev", attendance: 88 },
    { subject: "Database", attendance: 85 },
    { subject: "Networks", attendance: 90 },
    { subject: "OS", attendance: 87 },
  ];

  const attendanceDistribution = [
    { name: "Excellent (90-100%)", value: 45, color: "#22c55e" },
    { name: "Good (75-89%)", value: 30, color: "#14b8a6" },
    { name: "Average (60-74%)", value: 20, color: "#f59e0b" },
    { name: "Poor (<60%)", value: 5, color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time attendance insights and trends</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6 bg-gradient-card shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                <p className="text-3xl font-bold text-primary">2,847</p>
              </div>
              <Users className="w-12 h-12 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Attendance</p>
                <p className="text-3xl font-bold text-secondary">87.5%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-secondary opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sessions Today</p>
                <p className="text-3xl font-bold text-accent">24</p>
              </div>
              <Calendar className="w-12 h-12 text-accent opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Top Performer</p>
                <p className="text-3xl font-bold text-primary">95.2%</p>
              </div>
              <Award className="w-12 h-12 text-primary opacity-20" />
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 bg-gradient-card shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">Attendance Trend (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">Subject-wise Attendance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
                <Legend />
                <Bar dataKey="attendance" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-6 bg-gradient-card shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">Student Distribution by Attendance</h2>
          <div className="flex flex-col md:flex-row items-center justify-around">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 md:mt-0 space-y-2">
              {attendanceDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-sm font-semibold text-foreground">{item.value}%</span>
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
