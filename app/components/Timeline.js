import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import UploadArea from './UploadArea';

export default function Timeline({ stages, currentStageId, onUpload, isAnalyzing }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Status Permohonan Sertifikasi</h2>
      
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        {stages.map((stage, index) => {
          const isActive = stage.id === currentStageId;
          const isCompleted = stage.status === 'completed';
          const isActionRequired = stage.status === 'action_required';

          return (
            <div key={stage.id} className="relative flex items-start group">
              {/* Icon Status */}
              <div className={`absolute left-0 h-10 w-10 flex items-center justify-center rounded-full border-2 bg-white z-10 
                ${isCompleted ? 'border-green-500 text-green-500' : 
                  isActionRequired ? 'border-red-500 text-red-500' : 
                  isActive ? 'border-halal-500 text-halal-500' : 'border-gray-300 text-gray-300'}`}>
                {isCompleted ? <CheckCircle size={20} /> : 
                 isActionRequired ? <AlertCircle size={20} /> :
                 isActive ? <Clock size={20} className="animate-pulse" /> : <Circle size={20} />}
              </div>

              {/* Content Card */}
              <div className="ml-16 w-full">
                <div className={`p-5 rounded-lg border transition-all ${isActive || isActionRequired ? 'bg-white border-halal-100 shadow-md' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`font-bold text-lg ${isActive ? 'text-halal-900' : 'text-gray-700'}`}>{stage.stage}</h3>
                      <p className="text-sm text-gray-600">{stage.description}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
                      {stage.date}
                    </span>
                  </div>

                  {/* Task List */}
                  <ul className="mt-4 space-y-2">
                    {stage.tasks.map((task, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        {task.done ? <CheckCircle size={14} className="text-green-500" /> : <Circle size={14} className="text-gray-300" />}
                        <span className={task.done ? 'line-through text-gray-400' : ''}>{task.name}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Upload Area Special for Stage 1 */}
                  {stage.id === 1 && isActionRequired && (
                    <UploadArea onUpload={onUpload} isAnalyzing={isAnalyzing} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}