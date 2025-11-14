import jsPDF from "jspdf";

export const generatePDF = (predictedImg, detectionInfo) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4"
  });

  // Logo (pastikan logo.png ada di public)
  const logo = window.location.origin + "/logo.png";
  const today = new Date();
  const tgl = today.toLocaleDateString("id-ID");

  // Logo kiri atas
  doc.addImage(logo, "PNG", 40, 30, 45, 40);
  doc.text("RekoMed", 95, 60);

  // Tanggal kanan atas
  doc.setFont("poppins", "normal");
  doc.setFontSize(12);
  doc.text(`Tanggal ${tgl}`, 420, 50);

  // Judul tengah
  doc.setFont("poppins", "bold");
  doc.setFontSize(22);
  doc.text("Hasil Konstruksi Citra X-ray", 300, 90, { align: "center" });

  // Penjelasan
  doc.setFont("poppins", "normal");
  doc.setFontSize(12);
  doc.text(
    "Proses konstruksi citra X-ray dilakukan untuk menghasilkan visualisasi hasil deteksi tulang berdasarkan model yang telah dilatih. Citra di bawah menunjukkan hasil akhir dari analisis sistem.",
    60,
    120,
    { maxWidth: 480 }
  );

  // Info Deteksi
  doc.setFont("poppins", "bold");
  doc.setFontSize(12);
  doc.text(`Jumlah Fracture Terdeteksi : ${detectionInfo.length}`, 60, 160);

  if (detectionInfo.length > 0) {
    doc.setFont("poppins", "normal");
    doc.text(
      `Confidence : ${(detectionInfo[0].confidence * 100).toFixed(1)}%`,
      60,
      180
    );
    doc.text(
      `Koordinat : ${detectionInfo[0].bbox.map(x => x.toFixed(1)).join(', ')}`,
      60,
      200
    );
  }

  // Judul gambar
  doc.setFont("poppins", "bold");
  doc.setFontSize(14);
  doc.text("Hasil Deteksi Model YOLOv8", 300, 240, { align: "center" });

  // Gambar hasil deteksi (predicted)
  if (predictedImg) {
    doc.addImage(predictedImg, "JPEG", 170, 260, 260, 260);
  }

  // Keterangan bawah
  doc.setFont("helveticaS", "normal");
  doc.setFontSize(12);
  if (detectionInfo.length > 0) {
    doc.text(
      `Model YOLOv8 berhasil mendeteksi adanya indikasi fraktur pada citra X-ray dengan tingkat persentasi sebesar ${(detectionInfo[0].confidence * 100).toFixed(1)}%.`,
      60,
      540,
      { maxWidth: 420 }
    );
  }

  doc.save("hasil_prediksi.pdf");
};