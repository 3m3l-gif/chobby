
import React, { useState } from 'react';
import { Activity, MovieActivity } from '../types';
import { Plus, Trash2, Film, Monitor, List, PenTool, CheckCircle, Search } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  activities: MovieActivity[];
  platforms: string[];
  onAdd: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Activity>) => void;
}

const MovieManager: React.FC<Props> = ({ activities, platforms, onAdd, onDelete, onUpdate }) => {
  const [activeMode, setActiveMode] = useState<'record' | 'list'>('list');
  const [tab, setTab] = useState<'wishlist' | 'watched'>('wishlist');
  const [searchTerm, setSearchTerm] = useState('');
  
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

    // 중복 체크
    if (activities.some(a => a.title.trim() === formData.title.trim())) {
      alert('이미 등록된 영화 제목입니다.');
      return;
    }

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
  };

  const handleMarkAsWatched = (id: string) => {
    onUpdate(id, { 
      isCompleted: true,
      endDate: format(new Date(), 'yyyy-MM-dd')
    });
  };

  const filteredByTab = activities.filter(a => a.isCompleted === (tab === 'watched'));
  const searched = filteredByTab.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.platform && a.platform.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">간단 메모</label>
                    <textarea 
                      value={formData.memo}
                      onChange={e => setFormData({...formData, memo: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      rows={4}
                      placeholder="영화에 대한 짧은 평이나 기억에 남는 장면을 적어보세요."
                    />
                  </div>
                </>
              )}
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-100 mt-2 text-lg"
              >
                기록 완료
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex bg-white p-1 border border-slate-200 rounded-xl w-fit">
              <button 
                onClick={() => setTab('wishlist')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'wishlist' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                보고 싶은 영화 ({activities.filter(a => !a.isCompleted).length})
              </button>
              <button 
                onClick={() => setTab('watched')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'watched' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                이미 본 영화 ({activities.filter(a => a.isCompleted).length})
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="제목, 플랫폼 검색..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-48 md:w-64"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">제목</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">플랫폼</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">등록일</th>
                    {tab === 'watched' && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">관람일</th>}
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {searched.length === 0 ? (
                    <tr>
                      <td colSpan={tab === 'watched' ? 5 : 4} className="px-6 py-16 text-center text-slate-400 font-medium">
                        {searchTerm ? '검색 결과가 없습니다.' : '등록된 영화가 없습니다.'}
                      </td>
                    </tr>
                  ) : (
                    searched.map(item => (
                      <React.Fragment key={item.id}>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-800">{item.title}</td>
                          <td className="px-6 py-4 text-slate-600 text-sm">
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] rounded-full font-bold border border-indigo-100 uppercase">
                              {item.platform || '기타'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs font-medium">{format(new Date(item.createdAt), 'yyyy.MM.dd')}</td>
                          {tab === 'watched' && (
                            <td className="px-6 py-4 text-slate-400 text-[10px] font-medium italic">
                              {item.endDate || '-'}
                            </td>
                          )}
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1">
                              {!item.isCompleted && (
                                <button 
                                  onClick={() => handleMarkAsWatched(item.id)}
                                  className="p-2 text-slate-300 hover:text-emerald-500 transition-colors"
                                  title="본 영화 처리"
                                >
                                  <CheckCircle size={18} />
                                </button>
                              )}
                              <button 
                                onClick={() => onDelete(item.id)} 
                                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {item.memo && tab === 'watched' && (
                          <tr className="bg-indigo-50/20">
                            <td colSpan={5} className="px-6 py-3 text-sm text-slate-600 border-b border-slate-100">
                              <div className="flex gap-2 items-start pl-4 border-l-2 border-indigo-200">
                                <span className="font-bold text-indigo-500 text-[10px] mt-1 shrink-0 uppercase tracking-tighter">Review</span>
                                <p className="italic text-slate-500 text-xs leading-relaxed">{item.memo}</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieManager;
