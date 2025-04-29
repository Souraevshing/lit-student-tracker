/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from "jspdf";

interface IUserData {
  fullName: string;
  institute: string;
  bloodGroup: string;
  email: string;
  contact: string;
  profileImage: string;
}

/**
 * Converts a File object to a base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Creates an Image object from a URL and returns a promise
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = src;
  });
};

/**
 * Generates a fallback PDF for ID cards when html2canvas fails
 */
export const generateFallbackPDF = async (
  userData: IUserData
): Promise<any> => {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a6",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Front page
    pdf.setFillColor(30, 30, 30); // Dark background
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    // Header
    pdf.setFillColor(37, 99, 235); // Blue header
    pdf.rect(0, 0, pageWidth, 15, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.text("LIT", 5, 10);

    pdf.setFontSize(8);
    pdf.text("LITCM085", pageWidth - 5, 10, { align: "right" });

    // Try to add profile image if available
    if (userData.profileImage) {
      try {
        const img = await loadImage(userData.profileImage);
        // Calculate dimensions for a small photo area
        const photoX = 5;
        const photoY = 20;
        const photoWidth = 25;
        const photoHeight = 30;

        // Add the image to the PDF
        pdf.addImage(img.src, "JPEG", photoX, photoY, photoWidth, photoHeight);
      } catch (imgError) {
        console.error("Failed to add profile image to PDF:", imgError);
        // Continue without the image
      }
    }

    // Content
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.text(userData.fullName || "John Doe", 35, 25);

    pdf.setFontSize(10);
    pdf.setTextColor(180, 180, 180);
    pdf.text(`${userData.institute || "LIT School"} CM04320`, 35, 30);

    pdf.setTextColor(255, 255, 255);
    pdf.text(userData.email || "johndoe@gmail.com", 35, 38);
    pdf.text(userData.contact || "+91 95568 97688", 35, 43);

    // Add blood group and other details
    pdf.setFontSize(8);
    pdf.text(
      `Blood Group: ${userData.bloodGroup?.replace("_", "") || "O+"}`,
      35,
      50
    );

    // Add issue and expiry dates
    const currentDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(currentDate.getFullYear() + 1);

    pdf.text(`Issued: ${currentDate.toLocaleDateString()}`, 5, pageHeight - 10);
    pdf.text(
      `Expires: ${expiryDate.toLocaleDateString()}`,
      pageWidth - 5,
      pageHeight - 10,
      { align: "right" }
    );

    // Add a new page for the back
    pdf.addPage();

    // Back page
    pdf.setFillColor(30, 30, 30); // Dark background
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.text("TERMS AND CONDITIONS", pageWidth / 2, 10, { align: "center" });

    pdf.setFontSize(8);
    pdf.setTextColor(200, 200, 200);
    pdf.text(
      "1. This card is the property of LIT School and must be returned upon request.",
      5,
      20
    );
    pdf.text(
      "2. If found, please return to LIT School or the nearest police station.",
      5,
      25
    );
    pdf.text(
      "3. This card is non-transferable and must be carried at all times within campus.",
      5,
      30
    );
    pdf.text(
      "4. Loss of card should be reported immediately to the administration.",
      5,
      35
    );
    pdf.text("5. Replacement fee for lost card is ₹500.", 5, 40);

    // Add emergency contacts
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text("Emergency Contacts:", 5, 50);

    pdf.setFontSize(8);
    pdf.setTextColor(200, 200, 200);
    pdf.text("Campus Security: +91 98765 43210", 5, 55);
    pdf.text("Medical Emergency: +91 98765 12345", 5, 60);

    // Add card ID and student ID
    pdf.text("Card ID: LITCM085", 5, pageHeight - 15);
    pdf.text("Student ID: CM04320", 5, pageHeight - 10);

    return pdf;
  } catch (error) {
    console.error("Error generating fallback PDF:", error);
    return null;
  }
};
