import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, QrCode, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface AttendanceRecord {
  date: string;
  subject: string;
  status: "present" | "absent";
}

const Student = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  
  // Mock attendance data
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    { date: "2025-01-29", subject: "Data Structures", status: "present" },
    { date: "2025-01-28", subject: "Web Development", status: "present" },
    { date: "2025-01-27", subject: "Database Systems", status: "absent" },
    { date: "2025-01-26", subject: "Data Structures", status: "present" },
    { date: "2025-01-25", subject: "Web Development", status: "present" },
  ]);

  const attendancePercentage = Math.round(
    (attendanceRecords.filter(r => r.status === "present").length / attendanceRecords.length) * 100
  );

  const handleScanQR = () => {
    if (!studentId || !studentName) {
      toast({
        title: "Missing Information",
        description: "Please enter your student ID and name",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    // Simulate QR scanning
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Attendance Marked",
        description: "You have been marked present for this session",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Student Portal</h1>
          <p className="text-muted-foreground">Mark your attendance and view records</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 bg-gradient-card shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Mark Attendance</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="e.g., 2021CSE001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="studentName">Full Name</Label>
                <Input
                  id="studentName"
                  placeholder="e.g., John Doe"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleScanQR}
              className="w-full"
              size="lg"
              disabled={isScanning}
            >
              {isScanning ? (
                <>Scanning QR Code...</>
              ) : (
                <>
                  <QrCode className="w-5 h-5 mr-2" />
                  Scan QR Code
                </>
              )}
            </Button>

            <p className="text-sm text-muted-foreground mt-4 text-center">
              Scan the teacher's QR code to mark your attendance
            </p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Attendance Overview</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Overall Attendance</span>
                  <span className="text-2xl font-bold text-primary">{attendancePercentage}%</span>
                </div>
                <Progress value={attendancePercentage} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    <span className="text-sm text-muted-foreground">Present</span>
                  </div>
                  <p className="text-2xl font-bold text-accent">
                    {attendanceRecords.filter(r => r.status === "present").length}
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <span className="text-sm text-muted-foreground">Absent</span>
                  </div>
                  <p className="text-2xl font-bold text-destructive">
                    {attendanceRecords.filter(r => r.status === "absent").length}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-gradient-card shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-card-foreground">Recent Attendance</h2>
          </div>
          
          <div className="space-y-3">
            {attendanceRecords.map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {record.status === "present" ? (
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{record.subject}</p>
                    <p className="text-sm text-muted-foreground">{record.date}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    record.status === "present"
                      ? "bg-accent/10 text-accent"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {record.status === "present" ? "Present" : "Absent"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Student;
