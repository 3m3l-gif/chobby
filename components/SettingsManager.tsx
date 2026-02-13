
import React, { useRef, useState } from 'react';
import { Activity, CloudSettings } from '../types';
import { 
  Download, Upload, ShieldCheck, Database, FileJson, 
  AlertCircle, Plus, X, MonitorPlay, Server,
  CloudIcon, RefreshCw, Copy, Link
} from 'lucide-react';

interface Props {
  activities: Activity[];
  platforms: string[];
  cloudMeta: CloudSettings;
  onUpdateCloudMeta: (meta: CloudSettings) => void;
  onAddPlatform: (name: string) => void;
  onDeletePlatform: (name: string) => void;
  onImport: (activities: Activity[]) => void;
}

const SettingsManager: React.FC<Props> = ({ 
  activities, platforms, cloudMeta, 
  onUpdateCloudMeta, onAddPlatform, 
  onDeletePlatform, onImport 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPlatform, setNewPlatform] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [urlInput, setUrlInput] = useState(cloudMeta.dbUrl);
  const [keyInput, setKeyInput] = useState(cloudMeta.dbKey);

  const exportData = () => {
    const dataStr = JSON.stringify(activities, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `chobby_backup_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const copyToClipboard = () => {
    const dataStr = JSON.stringify(activities, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      alert('데이터가 클립보드에 복사되었습니다.');
    });
  };

  // Supabase style REST API sync logic
  const syncToCloud = async () => {
    if (!urlInput || !keyInput) return alert('데이터베이스 URL과 API 키가 필요합니다.');
    setIsSyncing(true);
    
    try {
      // 이 예시에서는 Supabase의 Storage나 JSON Bin 스타일의 REST API를 상정합니다.
      // 실제 구현 시에는 특정 DB 구조에 맞춰 Fetch 호출을 조정할 수 있습니다.
      const response = await fetch(`${urlInput.replace(/\/$/, '')}/rest/v1/user_data`, {
        method: 'POST',
        headers: {
          'apikey': keyInput,
          'Authorization': `Bearer ${keyInput}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({ 
          id: 'default_user', // 실제로는 유저 고유 ID 사용 권장
          data: activities,
          updated_at: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Cloud API Error');
      
      onUpdateCloudMeta({
        dbUrl: urlInput,
        dbKey: keyInput,
        lastSyncedAt: new Date().toLocaleString()
      });
      alert('데이터베이스에 안전하게 백업되었습니다!');
    } catch (err) {
      console.error(err);
      alert('동기화 실패: URL이 잘못되었거나 API 키 권한이 없습니다.');
    } finally {
      setIsSyncing(false);
    }
  };

  const pullFromCloud = async () => {
    if (!urlInput || !keyInput) return alert('연결 정보가 없습니다.');
    setIsSyncing(true);

    try {
      const response = await fetch(`${urlInput.replace(/\/$/, '')}/rest/v1/user_data?id=eq.default_user`, {
        headers: { 
          'apikey': keyInput,
          'Authorization': `Bearer ${keyInput}`
        }
      });
      if (!response.ok) throw new Error('Cloud API Error');
      
      const result = await response.json();
      if (result && result.length > 0) {
        const cloudData = result[0].data;
        if (confirm('클라우드 데이터를 불러오면 현재 로컬 데이터가 교체됩니다. 계속하시겠습니까?')) {
          onImport(cloudData);
          onUpdateCloudMeta({ ...cloudMeta, lastSyncedAt: new Date().toLocaleString() });
          alert('데이터를 성공적으로 동기화했습니다!');
        }
      } else {
        alert('서버에 저장된 데이터가 없습니다.');
      }
    } catch (err) {
      alert('데이터를 가져오는데 실패했습니다.');
    } finally {
      setIsSyncing(false);
    }
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
        } else { alert('올바른 백업 파일 형식이 아닙니다.'); }
      } catch (err) { alert('파일을 읽는 중에 오류가 발생했습니다.'); }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">설정 및 데이터 관리</h2>
        <p className="text-slate-500 text-sm">로컬 스토리지를 넘어 개인 데이터베이스와 연동하세요.</p>
      </div>

      {/* Database Sync Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
              <Server size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-none">클라우드 DB 동기화</h3>
              <p className="text-xs text-slate-400 mt-1">Supabase 등 REST API를 지원하는 DB와 연동합니다.</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${cloudMeta.dbUrl ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${cloudMeta.dbUrl ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
            {cloudMeta.dbUrl ? '연결됨' : '미연결'}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 flex items-center gap-1">
                <Link size={12} /> Database URL
              </label>
              <input 
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="https://your-project.supabase.co"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 flex items-center gap-1">
                <ShieldCheck size={12} /> API Anon Key
              </label>
              <input 
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="eyJhbG..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={syncToCloud}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 text-sm"
            >
              {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <CloudIcon size={16} />}
              서버에 백업
            </button>
            <button 
              onClick={pullFromCloud}
              disabled={isSyncing || !cloudMeta.dbUrl}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all text-sm"
            >
              <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
              데이터 동기화
            </button>
          </div>
          
          {cloudMeta.lastSyncedAt && (
            <p className="text-center text-[10px] text-slate-400 font-medium">마지막 동기화: {cloudMeta.lastSyncedAt}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Local Backup Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Download size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">로컬 파일 내보내기</h3>
          <p className="text-slate-500 text-xs mb-4 leading-relaxed flex-1">
            데이터를 JSON 파일로 다운로드하여 개인 컴퓨터에 영구 보관합니다.
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
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Upload size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">백업 파일 불러오기</h3>
          <p className="text-slate-500 text-xs mb-4 leading-relaxed flex-1">
            저장해둔 JSON 백업 파일을 선택하여 현재 데이터를 복원합니다.
          </p>
          <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 rounded-xl transition-all text-xs"
          >
            <Database size={14} /> 파일 선택
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><MonitorPlay size={18} /></div>
          <h3 className="text-lg font-bold text-slate-800">영화 감상 플랫폼 관리</h3>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (newPlatform.trim()) { onAddPlatform(newPlatform.trim()); setNewPlatform(''); } }} className="flex gap-2 mb-5">
          <input type="text" value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="새 플랫폼 이름" />
          <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2"><Plus size={16} /> 추가</button>
        </form>
        <div className="flex flex-wrap gap-2">
          {platforms.length === 0 ? (<p className="text-slate-400 text-xs py-2">등록된 플랫폼이 없습니다.</p>) : (
            platforms.map(p => (
              <div key={p} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600">
                {p}
                <button onClick={() => onDeletePlatform(p)} className="p-0.5 hover:bg-slate-200 rounded-full transition-colors text-slate-300 hover:text-rose-500"><X size={12} /></button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
        <AlertCircle className="text-amber-500 shrink-0" size={20} />
        <div className="text-[11px] md:text-xs text-amber-800 leading-relaxed">
          <p className="font-bold mb-1">데이터 관리 팁</p>
          <p>브라우저 캐시는 삭제될 위험이 있으므로, <b>주기적으로 클라우드 DB에 백업</b>하거나 JSON 파일로 내보내어 안전하게 보관하세요.</p>
        </div>
      </div>

      <div className="pt-8 text-center">
        <p className="text-slate-300 text-[10px] font-bold flex items-center justify-center gap-1.5 uppercase tracking-widest">
          <ShieldCheck size={14} /> End-to-End Persistence via Personal Database
        </p>
      </div>
    </div>
  );
};

export default SettingsManager;
