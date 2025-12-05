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
    - Anda HARUS menyalin persis (Copy-Paste) salah satu string dari daftar [DAFTAR RUANG LINGKUP BAKU].
    - Anda DILARANG membuat nama kategori sendiri.
    - Contoh Salah: "Kategori Makanan Ringan".
    - Contoh Benar: "n. Makanan ringan siap santap".
    - Jika produk berupa menu restoran (Bakso, Soto, Nasi Goreng, dll), WAJIB masuk ke kategori: [A.p] Penyediaan makanan dan minuman dengan pengolahan.
    - Jangan gunakan nomor dokumen (7/2.1) sebagai nama kategori. Gunakan Kode Huruf (A.a, A.b, dst).
    
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
       a. STATUS: AMAN (HIJAU)
          - Kriteria 1: Bahan memiliki Nomor Sertifikat Halal yang terisi di kolom tabel (Valid).
          - Kriteria 2: BAHAN ALAM NABATI SEGAR (Sayur, Rempah Utuh, Buah, Umbi) meskipun beli di pasar tradisional tanpa sertifikat. Contoh: Laos, Jahe, Kunyit, Daun Jeruk, Bawang.
            -> Alasan: "Bahan Nabati Segar/Alami (Positive List)."
       
       b. STATUS: CEK LANJUT (KUNING)
          - Kriteria: Rempah BUBUK atau GILING yang dibeli di pasar tanpa merek/sertifikat. Contoh: "Merica Bubuk", "Ketumbar Halus".
            -> Alasan: "Potensi kontaminasi penggilingan atau anti-caking agent."
          - Kriteria: Bahan kimia/tambahan pangan tanpa sertifikat.

       c. STATUS: PRIORITAS TINGGI (MERAH)
          - Kriteria: Bahan HEWANI (Daging, Ayam, Lemak, Gelatin) TANPA Sertifikat Halal.
            -> Alasan: "Bahan Hewani Kritis. Wajib Sertifikat Halal (SH)."
    
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
        generationConfig: { 
          temperature: 0.0, // Matikan "kreativitas"
          topP: 1.0,
          maxOutputTokens: 8192,
          responseMimeType: "application/json" } // Force JSON output
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