'use client';
import { useState } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import AuditorPanel from './components/AuditorPanel';

// INITIAL DATA (Sesuai PRD Part 3 Poin 6)
const INITIAL_TIMELINE_DATA = [
  {
    id: 1,
    stage: "TAHAP I: SELEKSI",
    description: "Verifikasi Kelengkapan Dokumen & Administrasi",
    status: "action_required", // Default awal
    date: "Hari Ini",
    tasks: [
      { name: "Pendaftaran SIHALAL", done: true },
      { name: "Pembayaran Biaya Audit", done: true },
      { name: "Upload Formulir & Daftar Bahan", done: false }
    ]
  },
  {
    id: 2,
    stage: "TAHAP II: DETERMINASI",
    description: "Audit Lapangan & Pengujian Laboratorium",
    status: "locked",
    date: "Estimasi: 14 Hari Kerja",
    tasks: [
      { name: "Penunjukan Auditor", done: false },
      { name: "Audit Lapangan (On-Site)", done: false },
      { name: "Sampling & Uji Lab", done: false }
    ]
  },
  { id: 3, stage: "TAHAP III: TINJAUAN", description: "Review Laporan Hasil Audit", status: "locked", date: "-", tasks: [] },
  { id: 4, stage: "TAHAP IV: KEPUTUSAN", description: "Sidang Fatwa MUI", status: "locked", date: "-", tasks: [] },
  { id: 5, stage: "TAHAP V: LISENSI", description: "Penerbitan Sertifikat Halal", status: "locked", date: "-", tasks: [] }
];

export default function Home() {
  const [role, setRole] = useState('user'); // 'user' | 'auditor'
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE_DATA);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  // Fungsi saat User Upload PDF
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsAnalyzing(true);
    
    // Kirim ke API Gemini (app/api/analyze/route.js)
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setAnalysisData(data); // Simpan hasil analisis AI
      
      // Setelah selesai, update status sementara & pindah role otomatis agar User lihat hasilnya
      alert("Dokumen berhasil diunggah! Sistem AI telah melakukan pra-audit.");
      setRole('auditor'); 

    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menganalisis dokumen.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fungsi saat Auditor Klik "Setujui"
  const handleAuditorApprove = () => {
    // Update Timeline Logic
    const updatedTimeline = timeline.map(stage => {
      if (stage.id === 1) {
        return { 
          ...stage, 
          status: 'completed', 
          tasks: stage.tasks.map(t => ({...t, done: true})) 
        };
      }
      if (stage.id === 2) {
        return { ...stage, status: 'in_progress' };
      }
      return stage;
    });

    setTimeline(updatedTimeline);
    setRole('user'); // Kembalikan ke view User untuk melihat progres baru
    alert("Dokumen Disetujui! Status permohonan Pelaku Usaha telah diperbarui.");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Header role={role} setRole={setRole} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* VIEW PELAKU USAHA */}
        {role === 'user' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-halal-600 to-halal-900 rounded-2xl p-8 text-white shadow-lg">
              <h1 className="text-3xl font-bold mb-2">Selamat Datang, Pelaku Usaha!</h1>
              <p className="opacity-90">Pantau proses sertifikasi halal Anda secara transparan dan real-time di sini.</p>
            </div>
            <Timeline 
              stages={timeline} 
              currentStageId={timeline.find(t => t.status !== 'completed' && t.status !== 'locked')?.id || 1}
              onUpload={handleFileUpload}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {/* VIEW AUDITOR LPH */}
        {role === 'auditor' && (
          <div className="space-y-6 animate-fadeIn">
             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Auditor AI</h2>
                <p className="text-gray-500">Analisis Dokumen Otomatis & Kertas Kerja</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-gray-900">File Aktif:</p>
                <p className="text-halal-600 truncate max-w-xs">{analysisData ? "Formulir_Permohonan_Halal.pdf" : "-"}</p>
              </div>
            </div>
            
            <AuditorPanel 
              analysisData={analysisData} 
              onApprove={handleAuditorApprove}
            />
          </div>
        )}
      </main>
    </div>
  );
}