import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const BarcodeScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        await codeReaderRef.current.decodeFromVideoDevice(
          null,
          videoRef.current,
          (result, err) => {
            if (result) {
              onScan(result.getText());
            }
          }
        );
      } catch (error) {
        console.error("Scanner error:", error);
      }
    };

    startScanner();

    return () => {
      // Proper cleanup
      if (codeReaderRef.current) {
        codeReaderRef.current.reset?.(); // optional chaining in case it exists
        codeReaderRef.current.stopContinuousDecode?.(); // safest cleanup
      }
      // Stop the camera manually
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScan]);

  return <video ref={videoRef} style={{ width: "25%" }} />;
};

export default BarcodeScanner;
