import { AlertTriangle, CheckCircle, FileText, XCircle } from 'lucide-react';

export default function AuditorPanel({ analysisData, onApprove }) {
  if (!analysisData) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
        <FileText size={48} className="mb-4" />
        <p>Belum ada dokumen yang diunggah oleh Pelaku Usaha.</p>
      </div>
    );
  }

  const { audit_summary, detailed_audit } = analysisData;

  return (
    <div className="space-y-6">
      {/* 1. Scope Classification Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-halal-500 border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Klasifikasi Ruang Lingkup Otomatis</h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{audit_summary.scope_classification.code}</span>
              <span className="text-lg text-gray-700">{audit_summary.scope_classification.category}</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">Produk Terdeteksi: <span className="font-medium text-gray-900">{audit_summary.detected_product}</span></p>
          </div>
          <div className="text-right">
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-100">
              <p className="text-xs font-bold uppercase">Temuan Kritis</p>
              <p className="text-2xl font-bold">{audit_summary.critical_count}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700 italic border border-gray-100">
          &quot;AI Note: {audit_summary.conclusion_text}&quot;
        </div>
      </div>

      {/* 2. Intelligent Ingredient Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-900">Kertas Kerja Audit (Pra-Audit)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
              <tr>
                <th className="px-6 py-3">Bahan</th>
                <th className="px-6 py-3">Produsen</th>
                <th className="px-6 py-3">Dokumen</th>
                <th className="px-6 py-3">Analisis Risiko (AI)</th>
                <th className="px-6 py-3">Critical Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {detailed_audit.map((row, idx) => (
                <tr key={idx} className={`hover:bg-gray-50 ${row.audit_status === 'PRIORITAS TINGGI' ? 'bg-red-50' : row.audit_status === 'PERLU CEK' ? 'bg-yellow-50' : ''}`}>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.ingredient_name}</td>
                  <td className="px-6 py-4 text-gray-600">{row.producer || '-'}</td>
                  <td className="px-6 py-4">
                    {row.certificate_status === 'VALID' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ada Sertifikat
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Tidak Ada
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-gray-800 font-medium">{row.recommendation}</p>
                    <p className="text-xs text-gray-500 mt-1">{row.risk_analysis}</p>
                  </td>
                  <td className="px-6 py-4">
                    {row.audit_status === 'AMAN' && <span className="flex items-center gap-1 text-green-600 font-bold"><CheckCircle size={16}/> Low</span>}
                    {row.audit_status === 'PRIORITAS TINGGI' && <span className="flex items-center gap-1 text-red-600 font-bold"><XCircle size={16}/> Medium</span>}
                    {row.audit_status === 'PERLU CEK' && <span className="flex items-center gap-1 text-yellow-600 font-bold"><AlertTriangle size={16}/> High</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
          Minta Revisi Dokumen
        </button>
        <button 
          onClick={onApprove}
          className="px-6 py-2 bg-halal-600 text-white rounded-lg font-medium hover:bg-halal-700 shadow-sm flex items-center gap-2"
        >
          <CheckCircle size={18} />
          Setujui & Lanjut ke Audit Lapangan
        </button>
      </div>
    </div>
  );
}