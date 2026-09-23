import QRCode from "qrcode";

export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 280,
      margin: 2,
      color: {
        dark: "#1b2a4a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    });
  } catch (err) {
    console.error("Error generating QR code data URL", err);
    return "";
  }
}

export async function generateQrSvgString(text: string): Promise<string> {
  try {
    return await QRCode.toString(text, {
      type: "svg",
      margin: 1,
      color: {
        dark: "#1b2a4a",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Error generating QR SVG", err);
    return "";
  }
}
