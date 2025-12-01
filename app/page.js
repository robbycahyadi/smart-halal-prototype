"use client";

import { useState } from "react";
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  FileText, // Ikon File Text cocok untuk PDF
  AlertCircle, 
  UploadCloud, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  ShieldCheck,
  FileCheck // Ikon file selesai
} from "lucide-react";

// ... (Bagian INITIAL_TIMELINE tetap sama, tidak perlu diubah) ...
const INITIAL_TIMELINE = [
  {
    id: 1,
    title: "Tahap I: Seleksi",
    description: "Verifikasi dokumen administrasi dan teknis.",
    status: "ACTION_REQUIRED", 
    date: "Estimasi: Hari Ini",
    subtasks: [
      { name: "Pendaftaran Akun", done: true },
      { name: "Input Data Perusahaan", done: true },
      { name: "Upload Bill of Materials (BoM)", done: false }
    ]
  },
  // ... (Sisa timeline sama)
  {
    id: 2,
    title: "Tahap II: Determinasi",
    description: "Audit lapangan dan pengujian laboratorium.",
    status: "PENDING",
    date: "Estimasi: 15 Okt 2025",
    subtasks: [
      { name: "Penunjukan Auditor", done: false },
      { name: "Audit Lapangan", done: false },
      { name: "Uji Lab (Jika perlu)", done: false }
    ]
  },
  {
    id: 3,
    title: "Tahap III: Tinjauan",
    description: "Review internal hasil audit oleh LPH.",
    status: "PENDING",
    date: "Estimasi: 20 Okt 2025",
    subtasks: []
  },
  {
    id: 4,
    title: "Tahap IV: Keputusan",
    description: "Sidang Fatwa Majelis Ulama Indonesia.",
    status: "PENDING",
    date: "Estimasi: 25 Okt 2025",
    subtasks: []
  },
  {
    id: 5,
    title: "Tahap V: Lisensi",
    description: "Penerbitan Sertifikat Halal oleh BPJPH.",
    status: "PENDING",
    date: "Estimasi: 30 Okt 2025",
    subtasks: []
  }
];

export default function SmartHalalDashboard() {
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);
  const [expandedStep, setExpandedStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // --- LOGIC: Handle PDF Upload ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe file di frontend
    if (file.type !== "application/pdf") {
      alert("Mohon upload file dengan format PDF.");
      return;
    }

    setIsUploading(true);
    setAiResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file); // Ini akan menghasilkan base64 string
    reader.onloadend = async () => {
      const base64String = reader.result;

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileBase64: base64String }), // Kirim ke backend
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || "Gagal memproses");

        if (data.status === "APPROVED") {
            handleSuccessAudit(data);
        } else {
            setAiResult({ success: false, ...data });
        }

      } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
      } finally {
        setIsUploading(false);
      }
    };
  };

  const handleSuccessAudit = (data) => {
    setAiResult({ success: true, ...data });
    const newTimeline = timeline.map(step => {
      if (step.id === 1) {
        return { 
          ...step, 
          status: "COMPLETED", 
          date: "Selesai: Baru saja",
          subtasks: step.subtasks.map(t => ({ ...t, done: true })) 
        };
      }
      if (step.id === 2) {
        return { ...step, status: "IN_PROGRESS", date: "Sedang Berlangsung" };
      }
      return step;
    });
    setTimeline(newTimeline);
    setExpandedStep(2);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
       {/* Header sama seperti sebelumnya... */}
      <header className="bg-purple-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">SHIP Dashboard</h1>
              <p className="text-xs text-purple-200">Smart Halal Integrated Platform</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">Dapur Lezat Nusantara</p>
            <p className="text-xs text-purple-300">ID Reg: 2025-10-001</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-8">
        
        {/* Timeline Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" /> Status Permohonan
            </h2>
            <div className="space-y-0">
              {timeline.map((step, index) => (
                <TimelineItem 
                  key={step.id} 
                  step={step} 
                  isLast={index === timeline.length - 1}
                  isOpen={expandedStep === step.id}
                  onToggle={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  onUpload={handleFileUpload}
                  isUploading={isUploading}
                />
              ))}
            </div>
          </div>
        </div>

        {/* AI Result Column */}
        <div className="md:col-span-1">
            {aiResult && (
                <div className={`rounded-xl shadow-sm border p-6 sticky top-24 animate-in fade-in slide-in-from-bottom-4 duration-500
                    ${aiResult.success ? 'bg-teal-50 border-teal-200' : 'bg-red-50 border-red-200'}`}>
                    
                    <h3 className={`font-bold flex items-center gap-2 mb-3
                        ${aiResult.success ? 'text-teal-800' : 'text-red-800'}`}>
                        {aiResult.success ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
                        Hasil Audit AI
                    </h3>
                    
                    <div className="text-sm mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border
                             ${aiResult.success ? 'bg-teal-100 text-teal-700 border-teal-300' : 'bg-red-100 text-red-700 border-red-300'}`}>
                             {aiResult.status}
                        </span>
                    </div>

                    <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                        {aiResult.summary}
                    </p>

                    {aiResult.critical_items?.length > 0 && (
                        <div className="bg-white/60 p-3 rounded-lg border border-slate-200/50">
                            <p className="text-xs font-bold uppercase text-slate-500 mb-2">Temuan Kritis:</p>
                            <ul className="space-y-2">
                                {aiResult.critical_items.map((item, idx) => (
                                    <li key={idx} className="text-xs flex justify-between items-start border-b border-slate-200 pb-1 last:border-0">
                                        <span className="font-medium text-red-700">{item.name}</span>
                                        <span className="text-slate-500 text-right text-[10px]">{item.risk}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {!aiResult && (
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                    <p className="text-sm">Analisis otomatis akan muncul di sini setelah Anda mengunggah dokumen PDF.</p>
                 </div>
            )}
        </div>

      </main>
    </div>
  );
}

// --- SUB-COMPONENT: TIMELINE ITEM (Updated for PDF) ---
function TimelineItem({ step, isLast, isOpen, onToggle, onUpload, isUploading }) {
    let statusColor = "bg-slate-200 border-slate-300 text-slate-500";
    let icon = <Circle className="w-4 h-4" />;
    
    if (step.status === "COMPLETED") {
        statusColor = "bg-teal-100 border-teal-300 text-teal-700";
        icon = <CheckCircle className="w-5 h-5" />;
    } else if (step.status === "IN_PROGRESS") {
        statusColor = "bg-blue-100 border-blue-300 text-blue-700";
        icon = <Loader2 className="w-5 h-5 animate-spin" />;
    } else if (step.status === "ACTION_REQUIRED") {
        statusColor = "bg-orange-100 border-orange-300 text-orange-700";
        icon = <AlertCircle className="w-5 h-5" />;
    }

    return (
        <div className="flex gap-4 relative">
            {!isLast && (
                <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-200 -z-10" />
            )}

            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10 bg-white ${statusColor}`}>
                {icon}
            </div>

            <div className="flex-1 pb-8">
                <div onClick={onToggle} className="flex justify-between items-start cursor-pointer group">
                    <div>
                        <h3 className={`font-bold text-lg ${step.status === 'PENDING' ? 'text-slate-400' : 'text-slate-800'}`}>
                            {step.title}
                        </h3>
                        <p className="text-sm text-slate-500">{step.date}</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400"/> : <ChevronDown className="w-5 h-5 text-slate-400"/>}
                </div>

                {isOpen && (
                    <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in slide-in-from-top-2 duration-200">
                        <p className="text-sm text-slate-700 mb-4">{step.description}</p>
                        
                        <div className="space-y-2 mb-4">
                            {step.subtasks.map((task, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    {task.done ? (
                                        <CheckCircle className="w-4 h-4 text-teal-500" />
                                    ) : (
                                        <Circle className="w-4 h-4 text-slate-300" />
                                    )}
                                    <span className={task.done ? "text-slate-700 line-through decoration-slate-300" : "text-slate-600"}>
                                        {task.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Area Upload Khusus PDF */}
                        {step.status === "ACTION_REQUIRED" && (
                            <div className="mt-4 border-t border-slate-200 pt-4">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {isUploading ? (
                                            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
                                        ) : (
                                            <FileText className="w-8 h-8 text-purple-600 mb-2" />
                                        )}
                                        <p className="mb-1 text-sm text-purple-700 font-semibold">
                                            {isUploading ? "Sedang Menganalisis..." : "Upload Dokumen BoM (PDF)"}
                                        </p>
                                        <p className="text-xs text-purple-500">Maksimal 10 MB</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="application/pdf" // Hanya menerima PDF
                                        onChange={onUpload}
                                        disabled={isUploading} 
                                    />
                                </label>
                                <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3"/> AI akan membaca tabel di dalam PDF Anda.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}