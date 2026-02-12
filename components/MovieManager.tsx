
import React, { useState } from 'react';
import { Activity, MovieActivity } from '../types';
import { Plus, Trash2, Film, Monitor, List, PenTool } from 'lucide-react';

interface Props {
  activities: MovieActivity[];
  platforms: string[];
  onAdd: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Activity>) => void;
}

const MovieManager: React.FC<Props> = ({ activities, platforms, onAdd, onDelete }) => {
  const [activeMode, setActiveMode] = useState<'record' | 'list'>('list');
  const [tab, setTab] = useState<'wishlist' | 'watched'>('wishlist');
  const [formData, setFormData] = useState({
    title: '',
    platform: platforms[0] || '기타',
    startDate: '',
    endDate: '',
    memo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newActivity: MovieActivity = {
      id: crypto.randomUUID(),
      category: 'movie',
      title: formData.title,
      platform: formData.platform,
      memo: formData.memo,
      startDate: tab === 'watched' ? formData.startDate : undefined,
      endDate: tab === 'watched' ? formData.endDate : undefined,
      createdAt: new Date().toISOString(),
      isCompleted: tab === 'watched'
    };

    onAdd(newActivity);
    setFormData({ title: '', platform: platforms[0] || '기타', startDate: '', endDate: '', memo: '' });
    setActiveMode('list');
  };

  const filtered = activities.filter(a => a.isCompleted === (tab === 'watched'));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">영화 관리</h2>
          <p className="text-slate-500">보고 싶은 영화와 감상한 영화를 정리하세요.</p>
        </div>
        
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveMode('record')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeMode === 'record' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            <PenTool size={16} /> 기록하기
          </button>
          <button 
            onClick={() => setActiveMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            <List size={16} /> 목록보기
          </button>
        </div>
      </div>

      {activeMode === 'record' ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-2 border border-slate-200 rounded-2xl mb-4 flex">
            <button onClick={() => setTab('wishlist')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'wishlist' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>보고 싶은 영화</button>
            <button onClick={() => setTab('watched')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'watched' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>이미 본 영화</button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-600">
              <Plus size={24} />
              {tab === 'wishlist' ? '위시리스트 추가' : '감상 기록 추가'}
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">영화 제목 <span className="text-indigo-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-medium"
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">감상 플랫폼</label>
                <select 
                  value={formData.platform}
                  onChange={e => setFormData({...formData, platform: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                >
                  {platforms.length > 0 ? platforms.map(p => <option key={p} value={p}>{p}</option>) : <option value="기타">플랫폼을 먼저 설정하세요</option>}
                </select>
                <p className="mt-1.5 text-xs text-slate-400">플랫폼 추가/삭제는 설정 메뉴에서 가능합니다.</p>
              </div>
              {tab === 'watched' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">시작일</label>
                      <input 
                        type="date" 
                        value={formData.startDate}
                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">종료일</label>
                      <input 
                        type="date" 
                        value={formData.endDate}
                        onChange={e => setFormData({...formData, endDate: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">한줄 평/메모</label>
                    <textarea 
                      value={formData.memo}
                      onChange={e => setFormData({...formData, memo: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      rows={4}
                      placeholder="영화에 대한 짧은 감상이나 기억하고 싶은 점을 적어보세요"
                    />
                  </div>
                </>
              )}
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-100 text-lg"
              >
                저장하기
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex bg-white p-1.5 border border-slate-200 rounded-xl w-fit">
            <button 
              onClick={() => setTab('wishlist')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'wishlist' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              볼 영화 ({activities.filter(a => !a.isCompleted).length})
            </button>
            <button 
              onClick={() => setTab('watched')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'watched' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              본 영화 ({activities.filter(a => a.isCompleted).length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full bg-white p-16 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
                <Film className="mx-auto mb-4 opacity-10" size={64} />
                영화 목록이 비어있습니다.
              </div>
            ) : (
              filtered.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all group relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${tab === 'watched' ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                        <Monitor size={22} />
                      </div>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-tight">
                        {item.platform}
                      </span>
                    </div>
                    <button onClick={() => onDelete(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3 leading-tight">{item.title}</h4>
                  {item.isCompleted && (
                    <div className="mt-4 pt-4 border-t border-slate-50 space-y-3">
                      <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                        {item.startDate} {item.endDate ? `~ ${item.endDate}` : ''}
                      </p>
                      {item.memo && (
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <p className="text-sm text-slate-600 italic leading-relaxed">"{item.memo}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieManager;
