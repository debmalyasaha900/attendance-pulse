import { useState } from "react";
import QrScanner from "react-qr-scanner";
import { useToast } from "@/components/ui/use-toast";

export default function ScanQR() {
  const { toast } = useToast();
  const [data, setData] = useState("");

  const handleScan = (result: any) => {
    if (!result) return;

    const scannedURL = result.text;
    setData(scannedURL);

    try {
      const urlObj = new URL(scannedURL);
      const session_id = urlObj.searchParams.get("session_id");
      const student_id = localStorage.getItem("studentId");

      if (!session_id || !student_id) {
        toast({
          title: "Error",
          description: "Missing student ID or session ID",
          variant: "destructive",
        });
        return;
      }

      fetch(
        `http://localhost:8080/api/qr-attendance?session_id=${session_id}&student_id=${student_id}`
      )
        .then((res) => res.text())
        .then((msg) =>
          toast({
            title: "Attendance Recorded ✅",
            description: msg,
          })
        );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">Scan QR to Mark Attendance</h2>

      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />

      <p className="mt-3">{data}</p>
    </div>
  );
}
