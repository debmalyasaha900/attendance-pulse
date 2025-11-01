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
        facingMode={"environment"} // ✅ back camera
        onScan={(result) => {
          if (result) {
            setData(result.text);
            window.location.href = result.text; // ✅ redirect to backend URL
          }
        }}
        onError={(error) => console.log(error)}
      />

      <p className="mt-3 break-all">{data}</p>
    </div>
  );
}
