import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const data = await req.json();
    const { fileBase64 } = data;

    if (!fileBase64) {
      return NextResponse.json({ error: "File data is required" }, { status: 400 });
    }

    // Bersihkan header base64 (data:application/pdf;base64,...)
    const base64Data = fileBase64.split(",")[1];

    // --- PERBAIKAN DI SINI ---
    // Menggunakan "gemini-1.5-flash-latest" yang lebih stabil ditemukan oleh API
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      Bertindaklah sebagai Auditor Halal LPH. 
      Analisis dokumen PDF (Bill of Materials/Daftar Bahan) yang dilampirkan ini.
      
      Tugas Anda:
      1. Baca Tabel dalam PDF tersebut.
      2. Validasi: Apakah ini dokumen Daftar Bahan/Resep?
      3. Scanning Bahan Kritis: Cari bahan-bahan berisiko tinggi seperti:
         - Alkohol / Ethanol / Rum / Mirin
         - Gelatin / Kolagen
         - Lemak Hewani / Lard / Shortening (tanpa keterangan nabati)
         - Enzim / Pepsin
      
      Output WAJIB JSON murni:
      {
        "status": "APPROVED" (jika bersih/aman) atau "REJECTED" (jika ada bahan haram/meragukan),
        "summary": "Ringkasan analisis 1 kalimat.",
        "critical_items": [
          { "name": "Nama Bahan", "risk": "Alasan Risiko", "action": "Wajib Upload Sertifikat Halal" }
        ]
      }
    `;

    const result = await model.generateContent([
      prompt,
      { 
        inlineData: { 
          data: base64Data, 
          mimeType: "application/pdf" 
        } 
      },
    ]);

    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanedText));

  } catch (error) {
    console.error("PDF Analysis Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses PDF. Pastikan file < 10MB.", details: error.message },
      { status: 500 }
    );
  }
}