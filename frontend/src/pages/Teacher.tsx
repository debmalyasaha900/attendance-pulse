import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Teacher = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [sessionId, setSessionId] = useState("");
  const [studentsPresent, setStudentsPresent] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            generateNewQR();
            return 20;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, timeLeft]);

  // ✅ GENERATES NEW QR EVERY 20 SECONDS
  const generateNewQR = async () => {
    const newSessionId = `SESSION_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    setSessionId(newSessionId);

    // ✅ QR URL for attendance API
    const qrURL = `http://localhost:8080/api/qr-attendance?session_id=${newSessionId}`;

    try {
      const qrImage = await QRCode.toDataURL(qrURL, {
        width: 300,
        margin: 2,
        color: {
          dark: "#0284c7",
          light: "#ffffff",
        },
      });

      setQrCode(qrImage);
    } catch (err) {
      console.error("QR generation error:", err);
    }
  };

  const startSession = async () => {
    if (!className || !subject) {
      toast({
        title: "Missing Information",
        description: "Please enter class name and subject",
        variant: "destructive",
      });
      return;
    }

    setSessionActive(true);
    setTimeLeft(20);
    setStudentsPresent(0);
    await generateNewQR();

    toast({
      title: "Session Started",
      description: "QR code is now active for attendance",
    });
  };

  const endSession = () => {
    setSessionActive(false);
    setQrCode("");

    toast({
      title: "Session Ended",
      description: `Total students marked present: ${studentsPresent}`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Teacher Portal</h1>
          <p className="text-muted-foreground">
            Generate QR codes for attendance tracking
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT SECTION */}
          <Card className="p-6 bg-gradient-card shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Session Setup</h2>

            <div className="space-y-4 mb-6">
              <div>
                <Label>Class Name</Label>
                <Input
                  placeholder="e.g., CSE-3A"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  disabled={sessionActive}
                />
              </div>

              <div>
                <Label>Subject</Label>
                <Input
                  placeholder="e.g., Data Structures"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={sessionActive}
                />
              </div>
            </div>

            {!sessionActive ? (
              <Button onClick={startSession} className="w-full" size="lg">
                Start Attendance Session
              </Button>
            ) : (
              <Button
                onClick={endSession}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                End Session
              </Button>
            )}
          </Card>

          {/* RIGHT SECTION */}
          <Card className="p-6 bg-gradient-card shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Active QR Code</h2>
              {sessionActive && (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm">Refreshes in {timeLeft}s</span>
                </div>
              )}
            </div>

            {sessionActive ? (
              <div className="space-y-6">
                <div className="flex justify-center bg-card p-6 rounded-lg border">
                  {qrCode ? (
                    <img src={qrCode} alt="QR Code" className="max-w-full" />
                  ) : (
                    <p>Loading QR...</p>
                  )}
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Session ID</span>
                    <code className="text-xs bg-background px-2 py-1 rounded">
                      {sessionId.slice(0, 18)}...
                    </code>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Students Present</span>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" />
                      <span className="text-lg font-bold">{studentsPresent}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">No active session</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
