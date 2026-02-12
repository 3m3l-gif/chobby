
import React, { useRef, useState } from 'react';
import { Activity } from '../types';
import { Download, Upload, ShieldCheck, Database, FileJson, AlertCircle, Plus, X, MonitorPlay } from 'lucide-react';

interface Props {
  activities: Activity[];
  platforms: string[];
  onAddPlatform: (name: string) => void;
  onDeletePlatform: (name: string) => void;
  onImport: (activities: Activity[]) => void;
}

const SettingsManager: React.FC<Props> = ({ activities, platforms, onAddPlatform, onDeletePlatform, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPlatform, setNewPlatform] = useState('');

  const exportData = () => {
    const dataStr = JSON.stringify(activities, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `chobby_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          if (confirm('현재 기록된 모든 데이터가 백업 파일로 교체됩니다. 계속하시겠습니까?')) {
            onImport(json);
            alert('성공적으로 불러왔습니다!');
          }
        } else {
          alert('올바른 백업 파일 형식이 아닙니다.');
        }
      } catch (err) {
        alert('파일을 읽는 중에 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddPlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlatform.trim()) {
      onAddPlatform(newPlatform.trim());
      setNewPlatform('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">설정 및 데이터 관리</h2>
        <p className="text-slate-500 text-sm">기록을 안전하게 백업하고 커스텀 설정을 관리하세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Export Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Download size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">기록 내보내기</h3>
          <p className="text-slate-500 text-xs mb-4 leading-relaxed flex-1">
            모든 데이터를 JSON 파일로 다운로드하여 로컬에 보관합니다.
          </p>
          <button 
            onClick={exportData}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm text-sm"
          >
            <FileJson size={16} /> 백업하기 (.json)
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Upload size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">기록 불러오기</h3>
          <p className="text-slate-500 text-xs mb-4 leading-relaxed flex-1">
            기존 백업 파일을 선택하여 데이터를 복원합니다.
          </p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".json" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 rounded-xl transition-all text-sm"
          >
            <Database size={16} /> 파일 불러오기
          </button>
        </div>
      </div>

      {/* Platform Management Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <MonitorPlay size={18} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">영화 감상 플랫폼 관리</h3>
        </div>
        
        <form onSubmit={handleAddPlatform} className="flex gap-2 mb-5">
          <input 
            type="text"
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="새 플랫폼 이름"
          />
          <button 
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <Plus size={16} /> 추가
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {platforms.length === 0 ? (
            <p className="text-slate-400 text-xs py-2">등록된 플랫폼이 없습니다.</p>
          ) : (
            platforms.map(p => (
              <div 
                key={p} 
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:border-slate-300 transition-colors"
              >
                {p}
                <button 
                  onClick={() => onDeletePlatform(p)}
                  className="p-0.5 hover:bg-slate-200 rounded-full transition-colors text-slate-300 hover:text-rose-500"
                >
                  <X size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
        <AlertCircle className="text-amber-500 shrink-0" size={20} />
        <div className="text-[11px] md:text-xs text-amber-800 leading-relaxed">
          <p className="font-bold mb-1">데이터 보관 안내</p>
          <p>브라우저 캐시 삭제 시 데이터가 소실될 수 있으니 정기적으로 백업 파일을 보관하시는 것을 권장합니다.</p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-[10px] font-bold flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} /> Chobby v1.2
        </p>
      </div>
    </div>
  );
};

export default SettingsManager;
