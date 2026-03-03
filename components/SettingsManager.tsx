import React, { useRef, useState } from 'react';
import { Activity } from '../types';
import { 
  Download, Upload, FileJson, 
  AlertCircle, Plus, X, MonitorPlay, 
  Copy, Database, HardDrive
} from 'lucide-react';

interface Props {
  activities: Activity[];
  platforms: string[];
  onAddPlatform: (name: string) => void;
  onDeletePlatform: (name: string) => void;
  onImport: (activities: Activity[]) => void;
}

const SettingsManager: React.FC<Props> = ({ 
  activities, platforms, 
  onAddPlatform, onDeletePlatform, onImport 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPlatform, setNewPlatform] = useState('');

  // 1. JSON 파일로 내보내기 (수정 버전)
  const exportData = () => {  // 데이터를 예쁜 JSON 문자열로 변환합니다.
    const dataStr = JSON.stringify(activities, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });  // 데이터를 파일 객체(Blob)로 만듭니다. (더 안전하고 표준적인 방식)
    const url = URL.createObjectURL(blob);  // 브라우저가 이 파일에 접근할 수 있는 임시 주소를 생성합니다.
    const exportFileDefaultName = `chobby_backup_${new Date().toISOString().split('T')[0]}.json`;  // 오늘 날짜를 포함한 파일명을 만듭니다.
    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.download = exportFileDefaultName;
    
    // 브라우저에 따라 링크가 문서에 붙어있어야 작동하는 경우가 있어 안전하게 추가합니다.
    document.body.appendChild(linkElement);
    linkElement.click();
    
    // 다운로드가 끝난 후 링크를 제거하고 메모리를 해제합니다.
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
  };

  // 2. 클립보드에 JSON 복사
  const copyToClipboard = () => {
    const dataStr = JSON.stringify(activities, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      alert('데이터가 클립보드에 복사되었습니다.');
    });
  };

  // 3. JSON 파일 불러오기
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          if (confirm('현재 기록된 모든 데이터가 불러온 파일 내용으로 교체됩니다. 계속하시겠습니까?')) {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">설정 및 데이터 관리</h2>
        <p className="text-slate-500 text-sm">기록 데이터를 안전하게 보관하고 관리하세요.</p>
      </div>

      {/* Data Management Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Export Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Download size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">데이터 내보내기</h3>
          <p className="text-slate-500 text-xs mb-4 leading-relaxed flex-1">
            작성한 모든 기록을 JSON 파일로 저장하거나 클립보드에 복사합니다.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={exportData}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm text-xs"
            >
              <FileJson size={14} /> 파일 저장
            </button>
            <button 
              onClick={copyToClipboard}
              className="px-4 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all border border-slate-200"
              title="클립보드 복사"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Import Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Upload size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">데이터 불러오기</h3>
          <p className="text-slate-500 text-xs mb-4 leading-relaxed flex-1">
            저장해둔 JSON 백업 파일을 선택하여 현재 기록을 복원합니다.
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
            className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 rounded-xl transition-all text-xs"
          >
            <Database size={14} /> 파일 선택하기
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
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            if (newPlatform.trim()) { 
              onAddPlatform(newPlatform.trim()); 
              setNewPlatform(''); 
            } 
          }} 
          className="flex gap-2 mb-5"
        >
          <input 
            type="text" 
            value={newPlatform} 
            onChange={(e) => setNewPlatform(e.target.value)} 
            className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="새 플랫폼 이름 (예: 넷플릭스)" 
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
              <div key={p} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600">
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

      {/* Warning Box */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
        <AlertCircle className="text-amber-500 shrink-0" size={20} />
        <div className="text-[11px] md:text-xs text-amber-800 leading-relaxed">
          <p className="font-bold mb-1">데이터 관리 주의사항</p>
          <p>브라우저 저장소(Local Storage)는 캐시 삭제 시 데이터가 소실될 수 있습니다. <b>중요한 기록은 반드시 주기적으로 JSON 파일로 내보내어</b> 안전하게 보관하세요.</p>
        </div>
      </div>

      <div className="pt-8 text-center">
        <p className="text-slate-300 text-[10px] font-bold flex items-center justify-center gap-1.5 uppercase tracking-widest">
          <HardDrive size={14} /> Local File-Based Persistence Enabled
        </p>
      </div>
    </div>
  );
};

export default SettingsManager;
