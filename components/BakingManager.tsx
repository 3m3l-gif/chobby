
import React, { useState } from 'react';
import { Activity, BakingActivity } from '../types';
import { Plus, Trash2, ExternalLink, Cookie, Thermometer, Clock, List, PenTool } from 'lucide-react';

interface Props {
  activities: BakingActivity[];
  onAdd: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Activity>) => void;
}

const BakingManager: React.FC<Props> = ({ activities, onAdd, onDelete }) => {
  const [activeMode, setActiveMode] = useState<'record' | 'list'>('list');
  const [tab, setTab] = useState<'planned' | 'completed'>('planned');
  const [formData, setFormData] = useState({
    title: '',
    scaling: '',
    ovenTemp: '',
    ovenTime: '',
    recipe: '',
    link: '',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newActivity: BakingActivity = {
      id: crypto.randomUUID(),
      category: 'baking',
      title: formData.title,
      scaling: formData.scaling,
      ovenTemp: formData.ovenTemp,
      ovenTime: formData.ovenTime,
      recipe: formData.recipe,
      link: formData.link,
      startDate: tab === 'completed' ? formData.startDate : undefined,
      endDate: tab === 'completed' ? formData.endDate : undefined,
      createdAt: new Date().toISOString(),
      isCompleted: tab === 'completed'
    };

    onAdd(newActivity);
    setFormData({ title: '', scaling: '', ovenTemp: '', ovenTime: '', recipe: '', link: '', startDate: '', endDate: '' });
    // setActiveMode('list'); // 연속 등록을 위해 목록 이동 로직 제거
  };

  const filtered = activities.filter(a => a.isCompleted === (tab === 'completed'));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">베이킹 관리</h2>
          <p className="text-slate-500">맛있는 빵과 과자를 기록하세요.</p>
        </div>
        
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveMode('record')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeMode === 'record' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
          >
            <PenTool size={16} /> 기록하기
          </button>
          <button 
            onClick={() => setActiveMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeMode === 'list' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
          >
            <List size={16} /> 목록보기
          </button>
        </div>
      </div>

      {activeMode === 'record' ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-2 border border-slate-200 rounded-2xl mb-4 flex">
            <button onClick={() => setTab('planned')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'planned' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>만들고 싶은 빵/과자</button>
            <button onClick={() => setTab('completed')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'completed' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>이미 만든 빵/과자</button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-orange-500">
              <Plus size={24} />
              {tab === 'planned' ? '레시피 준비' : '베이킹 완성 기록'}
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">제품명 <span className="text-orange-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-lg"
                  placeholder="예: 소금빵, 초코쿠키"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">계량 / 재료</label>
                <textarea 
                  value={formData.scaling}
                  onChange={e => setFormData({...formData, scaling: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  rows={3}
                  placeholder="밀가루 300g, 설탕 100g..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">오븐 온도</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.ovenTemp}
                      onChange={e => setFormData({...formData, ovenTemp: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="180℃"
                    />
                    <Thermometer className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">굽는 시간</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.ovenTime}
                      onChange={e => setFormData({...formData, ovenTime: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="15분"
                    />
                    <Clock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">참고 링크</label>
                <input 
                  type="url" 
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="참고한 영상/사이트 링크"
                />
              </div>
              {tab === 'completed' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">레시피/과정</label>
                    <textarea 
                      value={formData.recipe}
                      onChange={e => setFormData({...formData, recipe: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                      rows={3}
                      placeholder="조리법이나 주의사항을 남겨보세요."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">시작일</label>
                      <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">종료일</label>
                      <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none" />
                    </div>
                  </div>
                </>
              )}
              <button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-100 text-lg"
              >
                기록 완료
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex bg-white p-1.5 border border-slate-200 rounded-xl w-fit">
            <button onClick={() => setTab('planned')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'planned' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>계획 ({activities.filter(a => !a.isCompleted).length})</button>
            <button onClick={() => setTab('completed')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'completed' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>성공 ({activities.filter(a => a.isCompleted).length})</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full bg-white p-16 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
                <Cookie className="mx-auto mb-4 opacity-10" size={64} />
                베이킹 기록이 없습니다.
              </div>
            ) : (
              filtered.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all group overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-2xl font-bold text-slate-800 tracking-tight">{item.title}</h4>
                    <div className="flex gap-1">
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-orange-500">
                          <ExternalLink size={22} />
                        </a>
                      )}
                      <button onClick={() => onDelete(item.id)} className="p-2 text-slate-300 hover:text-rose-500">
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">계량 및 재료</p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{item.scaling || '-'}</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-orange-50 p-3 rounded-xl flex items-center justify-center gap-2 border border-orange-100">
                          <Thermometer size={16} className="text-orange-500" />
                          <span className="text-sm font-bold text-orange-700">{item.ovenTemp || '-'}</span>
                        </div>
                        <div className="flex-1 bg-amber-50 p-3 rounded-xl flex items-center justify-center gap-2 border border-amber-100">
                          <Clock size={16} className="text-amber-500" />
                          <span className="text-sm font-bold text-amber-700">{item.ovenTime || '-'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl h-full">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">과정/노트</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.recipe || '작성된 메모가 없습니다.'}</p>
                    </div>
                  </div>
                  {item.isCompleted && (
                    <div className="mt-5 pt-4 border-t border-slate-50 text-[11px] text-slate-400 font-medium">
                      기록일: {item.startDate} ~ {item.endDate}
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

export default BakingManager;
