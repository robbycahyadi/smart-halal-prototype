import { UploadCloud, Loader2 } from 'lucide-react';

export default function UploadArea({ onUpload, isAnalyzing }) {
  return (
    <div className="mt-4 border-2 border-dashed border-halal-500 bg-halal-50 rounded-xl p-8 text-center transition-all hover:bg-halal-100">
      <div className="flex flex-col items-center gap-3">
        {isAnalyzing ? (
          <>
            <Loader2 className="h-10 w-10 text-halal-600 animate-spin" />
            <div>
              <p className="font-semibold text-gray-900">Menganalisis Dokumen...</p>
              <p className="text-sm text-gray-500">AI sedang membaca tabel bahan & mendeteksi titik kritis.</p>
            </div>
          </>
        ) : (
          <>
            <div className="p-3 bg-white rounded-full shadow-sm">
              <UploadCloud className="h-8 w-8 text-halal-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Upload Formulir Permohonan & Daftar Bahan</p>
              <p className="text-sm text-gray-500 mb-4">Format PDF (Maks. 5MB). Pastikan tabel terbaca jelas.</p>
              
              <label className="cursor-pointer bg-halal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-halal-700 transition">
                Pilih File PDF
                <input 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  onChange={onUpload}
                />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}