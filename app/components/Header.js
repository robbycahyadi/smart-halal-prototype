import { Briefcase, ShieldCheck } from 'lucide-react';

export default function Header({ role, setRole }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="bg-halal-600 text-white p-2 rounded-lg font-bold">SHIP</div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">LPH BBSPJI Selulosa</h1>
            <p className="text-xs text-gray-500">Smart Halal Integrated Platform</p>
          </div>
        </div>

        {/* User Info */}
        <div className="hidden md:block text-sm text-right">
          <p className="font-medium text-gray-900">PT. Berkah Pangan Sejahtera</p>
          <p className="text-gray-500">Reg: 2025/10/001</p>
        </div>

        {/* Role Switcher (Toggle) */}
        <div className="bg-gray-100 p-1 rounded-lg flex items-center shadow-inner">
          <button
            onClick={() => setRole('user')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              role === 'user' ? 'bg-white text-halal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Briefcase size={16} /> Pelaku Usaha
          </button>
          <button
            onClick={() => setRole('auditor')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              role === 'auditor' ? 'bg-halal-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShieldCheck size={16} /> Auditor LPH
          </button>
        </div>
      </div>
    </header>
  );
}