// app/api/analyze/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { MASTER_SCOPE_CLASSIFICATION, MASTER_CRITICAL_POINTS_LOGIC } from "@/app/lib/knowledge";

// KONFIGURASI SESUAI PRD PART 2 (Poin 4.A)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Konversi File ke Base64 agar bisa dibaca Gemini
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileBase64 = buffer.toString("base64");

    // === SYSTEM PROMPT ARCHITECTURE (Sesuai PRD Part 2 Poin 3) ===
    const SYSTEM_PROMPT = `
    PERAN:
    Anda adalah Senior Auditor Halal Sistem Jaminan Produk Halal (SJPH) di LPH BBSPJI Selulosa.
    Tugas Anda adalah melakukan validasi dokumen pra-audit secara ketat, akurat, dan berbasis aturan (Rule-Based).

    REFERENSI WAJIB (JANGAN MENGARANG):
    1. [DAFTAR RUANG LINGKUP BAKU]:
    ${MASTER_SCOPE_CLASSIFICATION}
    
    2. [MATRIKS TITIK KRITIS & LOGIKA AUDIT]:
    ${MASTER_CRITICAL_POINTS_LOGIC}

    INSTRUKSI KERJA LANGKAH DEMI LANGKAH (STEP-BY-STEP):
    
    LANGKAH 1: NAVIGASI & DETEKSI JENIS FORMULIR
    - Baca Judul/Kop Formulir. Identifikasi apakah Makanan/Minuman/Barang/Jasa.
    - Tentukan Kategori Produk dengan mencocokkan Nama Produk user terhadap [DAFTAR RUANG LINGKUP BAKU].
    
    LANGKAH 2: LOKALISASI TABEL "DAFTAR NAMA BAHAN"
    - Cari halaman yang memuat tabel dengan judul spesifik: "Daftar Nama Bahan".
    - Fokus pada tabel yang memuat informasi Produsen dan Sertifikat.
    
    LANGKAH 3: EKSTRAKSI & AUDIT PER BARIS (ROW-BY-ROW)
    Baca setiap baris dan lakukan analisis:
    A. EKSTRAKSI DATA: Nama Bahan, Produsen, Lembaga Penerbit, Nomor Sertifikat.
    B. ANALISIS TITIK KRITIS (CRITICAL POINT DETECTION):
       - Cek [Nama Bahan] terhadap keyword risiko di [MATRIKS TITIK KRITIS].
       - Contoh: "Lemak" -> Cek Aturan Makanan No. 2. "Flavor" -> Cek Aturan Makanan No. 11.
    C. VERIFIKASI DOKUMEN PENDUKUNG:
       - STATUS: AMAN (HIJAU) -> Jika Positive List atau SH Valid.
       - STATUS: PRIORITAS TINGGI (MERAH) -> Jika TITIK KRITIS tapi Sertifikat KOSONG/"-". Berikan alasan: "Bahan Kritis [Kategori]. Wajib SH."
       - STATUS: PERLU CEK (KUNING) -> Bahan kimia/kompleks tanpa sertifikat.
    
    LANGKAH 4: FORMAT OUTPUT (STRICT JSON)
    Keluarkah hasil analisis HANYA dalam format JSON berikut:
    {
      "audit_summary": {
        "detected_product": "String",
        "scope_classification": {
           "code": "String",
           "category": "String"
        },
        "total_ingredients": Number,
        "critical_count": Number,
        "conclusion_text": "String ringkasan untuk auditor"
      },
      "detailed_audit": [
        {
          "row_number": Number,
          "ingredient_name": "String",
          "producer": "String",
          "certificate_status": "VALID" | "MISSING",
          "audit_status": "AMAN" | "PRIORITAS TINGGI" | "PERLU CEK",
          "risk_analysis": "String penjelasan teknis",
          "recommendation": "String tindakan"
        }
      ]
    }
    `;

    // Inisialisasi Model Gemini Flash (Sesuai PRD Part 2 Poin 4.A)
    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        generationConfig: { responseMimeType: "application/json" } // Force JSON output
    });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          data: fileBase64,
          mimeType: "application/pdf",
        },
      },
    ]);

    const responseText = result.response.text();
    const jsonResponse = JSON.parse(responseText);

    return NextResponse.json(jsonResponse);

  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Gagal memproses dokumen" }, { status: 500 });
  }
}