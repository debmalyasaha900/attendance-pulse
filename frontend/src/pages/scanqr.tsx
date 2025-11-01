import { useState } from "react";
import QrScanner from "react-qr-scanner";

export default function ScanQR() {
  const [data, setData] = useState("");

  const previewStyle = {
    height: 300,
    width: "100%",
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">Scan QR to Mark Attendance</h2>

      <QrScanner
        delay={300}
        style={previewStyle}
        onError={(err) => console.error(err)}
        onScan={(result) => {
          if (result) {
            setData(result.text);
            window.location.href = result.text; // ✅ Redirect to backend
          }
        }}
        constraints={{
          video: { facingMode: "environment" }, // ✅ Back camera
        }}
      />

      <p className="mt-3">{data}</p>
    </div>
  );
}
