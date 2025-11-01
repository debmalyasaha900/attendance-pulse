import { useState } from "react";
import QRCode from "qrcode";

export default function GenerateQR({ studentId, sessionId }) {
  const [qrImage, setQrImage] = useState("");

  const generateQR = async () => {
    const url = `https://your-backend-url.com/api/qr-attendance?student_id=${studentId}&session_id=${sessionId}`;

    const qr = await QRCode.toDataURL(url);
    setQrImage(qr);
  };

  return (
    <div>
      <button onClick={generateQR}>Generate QR Code</button>

      {qrImage && (
        <div>
          <img src={qrImage} alt="QR Code" style={{ width: 250 }} />
        </div>
      )}
    </div>
  );
}
