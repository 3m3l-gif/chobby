
import React, { useState } from 'react';
import { Activity, KnittingActivity } from '../types';
import { Plus, Trash2, ExternalLink, Scissors, List, PenTool } from 'lucide-react';

interface Props {
  activities: KnittingActivity[];
  onAdd: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Activity>) => void;
}

const KnittingManager: React.FC<Props> = ({ activities, onAdd, onDelete }) => {
  const [activeMode, setActiveMode] = useState<'record' | 'list'>('list');
  const [tab, setTab] = useState<'planned' | 'completed'>('planned');
  const [formData, setFormData] = useState({
    title: '',
    pattern: '',
    yarn: '',
    needleType: '대바늘',
    needleSize: '',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.needleType) return;

    const newActivity: KnittingActivity = {
      id: crypto.randomUUID(),
      category: 'knitting',
      title: formData.title,
      pattern: formData.pattern,
      yarn: formData.yarn,
      needleType: formData.needleType,
      needleSize: formData.needleSize,
      startDate: tab === 'completed' ? formData.startDate : undefined,
      endDate: tab === 'completed' ? formData.endDate : undefined,
      createdAt: new Date().toISOString(),
      isCompleted: tab === 'completed'
    };

    onAdd(newActivity);
    setFormData({ title: '', pattern: '', yarn: '', needleType: '대바늘', needleSize: '', startDate: '', endDate: '' });
    setActiveMode('list');
  };

  const filtered = activities.filter(a => a.isCompleted === (tab === 'completed'));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">뜨개질 기록</h2>
          <p className="text-slate-500">포근한 작품들을 계획하고 기록하세요.</p>
        </div>
        
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveMode('record')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeMode === 'record' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
          >
            <PenTool size={16} /> 기록하기
          </button>
          <button 
            onClick={() => setActiveMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeMode === 'list' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
          >
            <List size={16} /> 목록보기
          </button>
        </div>
      </div>

      {activeMode === 'record' ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-2 border border-slate-200 rounded-2xl mb-4 flex">
            <button onClick={() => setTab('planned')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'planned' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>만들고 싶은 제품</button>
            <button onClick={() => setTab('completed')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'completed' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>완성한 제품</button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-rose-500">
              <Plus size={24} />
              {tab === 'planned' ? '프로젝트 계획' : '완성 기록'}
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">작품명 <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-lg"
                  placeholder="예: 목도리, 스웨터"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">바늘 종류 <span className="text-rose-500">*</span></label>
                <div className="flex gap-2">
                  {['대바늘', '코바늘'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({...formData, needleType: t})}
                      className={`flex-1 py-3 rounded-xl border text-base font-bold transition-all ${
                        formData.needleType === t ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-slate-400 border-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">도안 링크</label>
                <input 
                  type="url" 
                  value={formData.pattern}
                  onChange={e => setFormData({...formData, pattern: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">사용 실 종류</label>
                  <input 
                    type="text" 
                    value={formData.yarn}
                    onChange={e => setFormData({...formData, yarn: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                    placeholder="실 정보"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">바늘 굵기</label>
                  <input 
                    type="text" 
                    value={formData.needleSize}
                    onChange={e => setFormData({...formData, needleSize: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                    placeholder="굵기(mm)"
                  />
                </div>
              </div>
              {tab === 'completed' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">시작일</label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">종료일</label>
                    <input 
                      type="date" 
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>
              )}
              <button 
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-100 text-lg"
              >
                기록 완료
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex bg-white p-1.5 border border-slate-200 rounded-xl w-fit">
            <button onClick={() => setTab('planned')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'planned' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>만들 예정 ({activities.filter(a => !a.isCompleted).length})</button>
            <button onClick={() => setTab('completed')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'completed' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>완성됨 ({activities.filter(a => a.isCompleted).length})</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full bg-white p-16 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
                뜨개질 기록이 없습니다.
              </div>
            ) : (
              filtered.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all group relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
                      <Scissors size={24} />
                    </div>
                    <div className="flex gap-1">
                      {item.pattern && (
                        <a href={item.pattern} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-rose-500">
                          <ExternalLink size={20} />
                        </a>
                      )}
                      <button onClick={() => onDelete(item.id)} className="p-2 text-slate-300 hover:text-rose-500">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-full border border-slate-100">{item.needleType}</span>
                    {item.needleSize && <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-full border border-slate-100">{item.needleSize}mm</span>}
                    {item.yarn && <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full border border-rose-100">{item.yarn}</span>}
                  </div>
                  {item.isCompleted && (
                    <div className="text-xs text-slate-400 font-medium border-t pt-3 border-slate-50">
                      기간: {item.startDate} ~ {item.endDate}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnittingManager;
