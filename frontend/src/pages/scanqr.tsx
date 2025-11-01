import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function ScanQR() {
  const [scanText, setScanText] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const studentId = localStorage.getItem("studentId");
  const studentName = localStorage.getItem("studentName");

  // ✅ Do not load scanner if student data missing
  useEffect(() => {
    if (!studentId || !studentName) {
      toast({
        title: "Student Info Missing",
        description: "Please fill your details before scanning QR",
        variant: "destructive",
      });
      navigate("/student");
    }
  }, []);

  // ✅ Function to send attendance to your backend (Supabase)
  async function markAttendance(sessionId: string) {
    try {
      const response = await fetch("https://your-backend-url.com/markAttendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          studentId,
          studentName,
          timestamp: Date.now(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Attendance Marked ✅",
          description: "Your attendance has been successfully recorded.",
        });
        navigate("/student");
      } else {
        toast({
          title: "Already Marked",
          description: "You have already marked attendance for this session.",
          variant: "destructive",
        });
        navigate("/student");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Scan QR to Mark Attendance</h2>

      <div style={{ width: "100%" }}>
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              const text = result.getText();
              setScanText(text);

              try {
                const parsed = JSON.parse(text); // ✅ QR contains JSON data
                const sessionId = parsed.sessionId;

                if (!sessionId) {
                  toast({
                    title: "Invalid QR",
                    description: "This QR does not contain valid session data.",
                    variant: "destructive",
                  });
                  return;
                }

                // ✅ Mark attendance
                markAttendance(sessionId);

              } catch {
                toast({
                  title: "Invalid QR",
                  description: "Cannot read session information.",
                  variant: "destructive",
                });
              }
            }

            // Ignore scanning errors
          }}
          constraints={{
            facingMode: { ideal: "environment" }, // ✅ Back camera
          }}
        />
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{scanText}</p>
    </div>
  );
}
