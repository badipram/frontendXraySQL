import jsPDF from "jspdf";

const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const ensureDataUrl = async (img) => {
  if (!img) return null;
  if (img.startsWith("data:")) return img;
  if (/^https?:\/\//i.test(img)) {
    try {
      const res = await fetch(img);
      const blob = await res.blob();
      return await blobToDataURL(blob);
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return null;
    }
  }
  if (/^[A-Za-z0-9+/=]+$/.test(img.replace(/\s+/g, "")) && img.length > 100) {
    return `data:image/jpeg;base64,${img}`;
  }
  return img;
};

export const generatePDF = async (predictedImg, detectionInfo = []) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;

  // Logo paths
  const leftLogo = window.location.origin + "/logoPDF.png";
  const rightLogo = window.location.origin + "/logo-unpam-300x291.png";

  const leftLogoData = await ensureDataUrl(leftLogo);
  const rightLogoData = await ensureDataUrl(rightLogo);

  // === HEADER ===
  if (leftLogoData) doc.addImage(leftLogoData, "PNG", margin - 15, 35, 57, 55);
  if (rightLogoData) doc.addImage(rightLogoData, "PNG", pageWidth - margin - 40, 35, 55, 55);

  // Header Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("RekoMed - REKONSTRUKSI MEDIS", pageWidth / 2, 50, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("FAKULTAS ILMU KOMPUTER - PROGRAM STUDI TEKNIK INFORMATIKA", pageWidth / 2, 68, { align: "center" });
  doc.text("UNIVERSITAS PAMULANG", pageWidth / 2, 83, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Alamat: Jl. Surya Kencana No. 1, Pamulang, Tangerang Selatan, Banten", pageWidth / 2, 98, { align: "center" });
  doc.text("Email: rekomed@gmail.com | Website: https://rekomed-app.vercel.app", pageWidth / 2, 113, { align: "center" });

  // Separator line
  doc.setDrawColor(0);
  doc.setLineWidth(2);
  doc.line(margin - 20, 125, pageWidth - margin + 20, 125);

  // === DATE ===
  const today = new Date();
  const tgl = today.toLocaleDateString("id-ID");
  doc.setFontSize(10);
  doc.text(`Tanggal ${tgl}`, pageWidth - margin, 150, { align: "right" });

  // === MAIN TITLE ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Hasil Konstruksi Citra X-ray", pageWidth / 2, 180, { align: "center" });

  // === DESCRIPTION ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const paragraph = 
    "Proses konstruksi citra X-ray dilakukan untuk menghasilkan visualisasi hasil " +
    "deteksi tulang berdasarkan model yang telah dilatih. Citra di bawah menunjukkan hasil akhir dari analisis sistem.";
  doc.text(paragraph, margin, 205, { maxWidth: pageWidth - margin * 2 });

  // === DETECTION INFO ===
  let infoY = 260;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Jumlah Fracture Terdeteksi : ${detectionInfo.length}`, margin, infoY);

  if (detectionInfo.length > 0) {
    const conf = ((detectionInfo[0].confidence || 0) * 100).toFixed(2);
    const bbox = (detectionInfo[0].bbox || []).map((n) => Number(n).toFixed(1)).join(", ");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Confidence : ${conf}%`, margin, infoY + 20);
    doc.text(`Koordinat : ${bbox}`, margin, infoY + 40);
  }

  // === SUBTITLE (Before image) ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Hasil Deteksi Model YOLOv8", pageWidth / 2, 330, { align: "center" });

  // === ADD IMAGE ===
  if (predictedImg) {
    const imgData = await ensureDataUrl(predictedImg);
    if (imgData) {
      let imgW = 260, imgH = 260;
      const img = new Image();
      img.src = imgData;
      await new Promise((res) => (img.onload = res));
      const aspect = img.width / img.height;
      if (aspect > 1) imgH = imgW / aspect;
      else imgW = imgH * aspect;
      const centerX = (pageWidth - imgW) / 2;
      doc.addImage(imgData, "JPEG", centerX, 350, imgW, imgH);
    }
  }

  // === FOOTER DESCRIPTION ===
  const footerY = 640;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  if (detectionInfo.length > 0) {
    const conf = ((detectionInfo[0].confidence || 0) * 100).toFixed(2);
    const text = `Model YOLOv8 berhasil mendeteksi adanya indikasi fraktur pada citra X-ray dengan tingkat persentasi sebesar ${conf}%.`;
    doc.text(text, margin, footerY, { maxWidth: pageWidth - margin * 2 });
  } else {
    doc.text(
      "Model YOLOv8 tidak mendeteksi adanya indikasi fraktur pada citra X-ray.",
      margin,
      footerY,
      { maxWidth: pageWidth - margin * 2 }
    );
  }

  // === SAVE FILE ===
  const filename = `RekoMed_Hasil_Konstruksi_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
