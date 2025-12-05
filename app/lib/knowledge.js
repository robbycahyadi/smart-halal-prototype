// app/lib/knowledge.js

// IMPLEMENTASI PRD PART 1: KNOWLEDGE BASE

export const MASTER_SCOPE_CLASSIFICATION = `
DAFTAR BAKU RUANG LINGKUP SERTIFIKASI (Sesuai SK Kemenag 748/2021 & SOP LPH):
[KELOMPOK A: MAKANAN - Ref Dokumen 7/2.1]
a. Susu dan analognya
b. Lemak, minyak, dan emulsi minyak
c. Es untuk dimakan (edible ice) termasuk sherbet dan sorbet
d. Buah dan sayur dengan pengolahan dan penambahan bahan tambahan pangan
e. Kembang gula/permen dan cokelat
f. Serealia dan produk serealia (turunan biji serealia, akar dan umbi, kacang-kacangan dan empulur dengan pengolahan)
g. Produk bakeri
h. Daging dan produk olahan daging
i. Ikan dan produk perikanan (termasuk moluska, krustase, dan ekinodermata dengan pengolahan)
j. Telur olahan dan produk-produk telur hasil olahan
k. Gula dan pemanis termasuk madu
l. Garam, rempah, sup, saus, salad, serta produk protein
m. Pangan olahan untuk keperluan gizi khusus
n. Makanan ringan siap santap
o. Pangan siap saji
p. Penyediaan makanan dan minuman dengan pengolahan
q. Bahan tambahan pangan (BTP)
r. Kelompok bahan lainnya
[KELOMPOK B: MINUMAN - Ref Dokumen 7/2.2]
a. Minuman dengan pengolahan
b. Kelompok bahan minuman
[KELOMPOK C: BARANG GUNAAN - Ref Dokumen 7/2.3]
a. Sandang
b. Penutup Kepala
c. Aksesoris
d. Perbekalan kesehatan rumah tangga
e. Peralatan rumah tangga
f. Perlengkapan peribadatan bagi umat Islam
g. Kemasan produk
h. Alat tulis dan perlengkapan kantor
i. Alat kesehatan
j. Bahan penyusun barang gunaan
[KELOMPOK D: PRODUK KIMIAWI - Ref Dokumen 7/2.4]
a. Kelompok bahan penolong
b. Bahan kimiawi lainnya
[KELOMPOK E: JASA - Ref Dokumen 7/2.5]
a. Jasa Pengemasan
`;

export const MASTER_CRITICAL_POINTS_LOGIC = `
ATURAN DETEKSI TITIK KRITIS BERDASARKAN DOKUMEN SOP:
=== [REFERENSI SOP 7/2.1: MAKANAN] ===
1. Susu & Analognya:
- Cek Bahan Penggumpal/Koagulan (Enzim Rennet/Pepsin): WAJIB Sertifikat Halal (SH). Risiko babi (Porcine).
- Cek Gelatin: WAJIB SH.
2. Lemak, Minyak, Emulsi:
- Cek Asal Bahan: Hewani atau Nabati? Jika Hewani WAJIB SH.
- Cek Katalis Esterifikasi: Pastikan status kehalalan.
- Cek Antioksidan/Stabilizer: Pastikan status kehalalan.
3. Es untuk dimakan (Edible Ice):
- Cek Bahan Penolong (Enzim/Gelatin): WAJIB SH.
4. Buah & Sayur Olahan:
- Cek Pelapis (Wax/Lilin): Pastikan bukan dari lemak hewani non-halal.
- Cek Enzim (Pectinase/Amilase): WAJIB SH.
5. Kembang Gula/Cokelat:
- Cek Emulsifier & Flavor: WAJIB SH/Dokumen Pendukung.
- Cek Gelatin (pada permen lunak/jelly): WAJIB SH.
- Cek Kuas Pengoles (pada Cokelat): Pastikan bukan bulu babi.
6. Serealia & Produk Serealia:
- Cek Fortifikasi Vitamin: Pastikan coating vitamin bukan gelatin babi.
7. Produk Bakeri (Roti/Kue):
- Cek Shortening/Margarin: WAJIB SH.
- Cek Rhum/Essence: Pastikan bebas alkohol khamr.
- Cek Pengembang/Yeast: Pastikan media tumbuh halal.
- Cek Kuas Oles Loyang: Pastikan bukan bulu babi.
8. Daging Olahan:
- Cek Daging: WAJIB SH dari RPH (Rumah Potong Hewan) valid.
- Cek Casing Sosis: Kolagen Sapi (Wajib SH) atau Sintetis.
9. Ikan Olahan:
- Cek Tepung Pelapis/Bumbu: Pastikan tidak ada bahan kritis hewani darat tanpa SH.
10. Gula, Pemanis, Madu:
- Cek Karbon Aktif (Untuk Rafinasi): DILARANG jika dari tulang hewan (kecuali ikan). AMAN jika dari Kayu/Batu Bara.
- Cek Resin Ion Exchange: Cek status kehalalan.
11. BTP (Bahan Tambahan Pangan):
- Pewarna, Perasa, Pengawet: Cek pelarut (Etanol < 0.5% & bukan khamr).
12. BAHAN ALAM & PASAR TRADISIONAL (Bumbu/Rempah):
- Jika bahan berupa Tumbuhan Utuh/Segar (Jahe, Lengkuas, Daun) -> Status: AMAN (Positive List).
- Jika bahan berupa BUBUK/GILING (Merica Bubuk, Kunyit Bubuk) dari Pasar Tradisional -> Status: PERLU CEK.
    (Risiko: Kontaminasi alat giling bekas daging non-halal atau campuran bahan lain).
- Jika nama bahan tidak spesifik (misal hanya "Merica"), asumsikan BUBUK jika dari Pasar -> Status: PERLU CEK.

=== [REFERENSI SOP 7/2.2: MINUMAN] ===
1. Alkohol/Etanol:
- Cek Kandungan: Residu pada produk akhir harus < 0.5%.
- Cek Sumber: DILARANG MUTLAK jika berasal dari Industri Khamr (Minuman Keras).
2. Bahan Penolong (Fining Agent):
- Cek Gelatin/Isinglass (Penjernih): WAJIB SH.
3. Flavor:
- Cek Pelarut: Pastikan bukan alkohol industri khamr.

=== [REFERENSI SOP 7/2.3: BARANG GUNAAN] ===
1. Sandang/Penutup Kepala/Aksesoris:
- Cek Bahan Kulit: DILARANG dari Kulit Babi atau Hewan Buas/Anjing.
- Cek Bahan Bulu: DILARANG dari Bulu Babi.
- Cek Pewarna Tekstil/Sizing Agent: Pastikan bebas lemak babi.
2. Alat Kesehatan/PKRT:
- Cek Bahan Aktif: Tidak boleh dari Manusia atau Babi.
3. Kemasan Produk:
- Cek Slip Agent (Plastik): Pastikan bukan turunan lemak hewani (Stearat) non-halal.

=== [REFERENSI SOP 7/2.4: PRODUK KIMIAWI] ===
1. Bahan Penolong & Kimia Lainnya:
- Cek Asam Lemak/Gliserol/Stearat: WAJIB tahu sumbernya (Nabati/Hewani). Jika Hewani WAJIB SH.
- Cek Media Fermentasi (Bio-Kimia): Media tidak boleh najis (Babi/Darah).
- Cek Karbon Aktif: Sama seperti aturan Gula (No Bone Charcoal dari hewan haram).

=== [REFERENSI SOP 7/2.5: JASA PENGEMASAN] ===
1. Bahan Kontak Produk:
- Cek Tinta Kode Produksi (Coding Ink): Pastikan pelarut bukan alkohol khamr.
- Cek Perekat (Adhesive/Lem): Pastikan bukan dari tulang/kulit hewan non-halal (Animal Glue).
2. Fasilitas:
- Pastikan mesin tidak digunakan bergantian dengan produk Non-Halal (Babi) tanpa pencucian syar'i (Sertu).
`;