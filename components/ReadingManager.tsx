
import React, { useState } from 'react';
import { Activity, ReadingActivity } from '../types';
import { Plus, Trash2, ArrowUpDown, List, PenTool, SortAsc, SortDesc, Calendar, Type } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  activities: ReadingActivity[];
  onAdd: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Activity>) => void;
}

const ReadingManager: React.FC<Props> = ({ activities, onAdd, onDelete }) => {
  const [activeMode, setActiveMode] = useState<'record' | 'list'>('list');
  const [tab, setTab] = useState<'wishlist' | 'completed'>('wishlist');
  const [sortField, setSortField] = useState<'title' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    startDate: '',
    endDate: '',
    memo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newActivity: ReadingActivity = {
      id: crypto.randomUUID(),
      category: 'reading',
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      memo: formData.memo,
      startDate: tab === 'completed' ? formData.startDate : undefined,
      endDate: tab === 'completed' ? formData.endDate : undefined,
      createdAt: new Date().toISOString(),
      isCompleted: tab === 'completed'
    };

    onAdd(newActivity);
    setFormData({ title: '', author: '', genre: '', startDate: '', endDate: '', memo: '' });
    // setActiveMode('list'); // 연속 등록을 위해 목록 이동 로직 제거
  };

  const filtered = activities.filter(a => a.isCompleted === (tab === 'completed'));
  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'title') {
      return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    } else {
      return sortOrder === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">독서 관리</h2>
          <p className="text-slate-500">읽고 싶거나 이미 읽은 책들을 기록하세요.</p>
        </div>
        
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveMode('record')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeMode === 'record' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'}`}
          >
            <PenTool size={16} /> 기록하기
          </button>
          <button 
            onClick={() => setActiveMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeMode === 'list' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'}`}
          >
            <List size={16} /> 목록보기
          </button>
        </div>
      </div>

      {activeMode === 'record' ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-2 border border-slate-200 rounded-2xl mb-4 flex">
            <button 
              onClick={() => setTab('wishlist')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'wishlist' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              읽지 않은 책 등록
            </button>
            <button 
              onClick={() => setTab('completed')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'completed' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              읽은 책 등록
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-amber-600">
              <Plus size={24} />
              {tab === 'wishlist' ? '위시리스트 추가' : '독서 기록 추가'}
            </h3>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">책 제목 <span className="text-amber-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-lg font-medium"
                    placeholder="제목을 입력하세요"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">작가</label>
                  <input 
                    type="text" 
                    value={formData.author}
                    onChange={e => setFormData({...formData, author: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="작가 이름"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">장르/종류</label>
                  <input 
                    type="text" 
                    value={formData.genre}
                    onChange={e => setFormData({...formData, genre: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="소설, 인문 등"
                  />
                </div>
              </div>
              
              {tab === 'completed' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">독서 시작일</label>
                      <input 
                        type="date" 
                        value={formData.startDate}
                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">독서 종료일</label>
                      <input 
                        type="date" 
                        value={formData.endDate}
                        onChange={e => setFormData({...formData, endDate: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">간단 메모</label>
                    <textarea 
                      value={formData.memo}
                      onChange={e => setFormData({...formData, memo: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      rows={4}
                      placeholder="책을 읽으며 느낀 점이나 기록하고 싶은 문장을 적어보세요."
                    />
                  </div>
                </>
              )}
              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-amber-100 mt-2 text-lg"
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
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'wishlist' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                읽지 않은 책 ({activities.filter(a => !a.isCompleted).length})
              </button>
              <button 
                onClick={() => setTab('completed')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'completed' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                읽은 책 ({activities.filter(a => a.isCompleted).length})
              </button>
            </div>

            {/* 분리된 정렬 컨트롤바 */}
            <div className="flex items-center gap-3 bg-white p-1.5 border border-slate-200 rounded-xl">
              <div className="flex bg-slate-50 p-0.5 rounded-lg border border-slate-100">
                <button 
                  onClick={() => setSortField('title')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${sortField === 'title' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Type size={14} /> 가나다순
                </button>
                <button 
                  onClick={() => setSortField('createdAt')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${sortField === 'createdAt' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Calendar size={14} /> 날짜순
                </button>
              </div>
              <div className="w-px h-4 bg-slate-200"></div>
              <button 
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                {sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
                {sortOrder === 'asc' ? '오름차순' : '내림차순'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">제목</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">작가</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">장르</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">등록일</th>
                    {tab === 'completed' && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">기간</th>}
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sorted.length === 0 ? (
                    <tr>
                      <td colSpan={tab === 'completed' ? 6 : 5} className="px-6 py-16 text-center text-slate-400 font-medium">등록된 책이 없습니다.</td>
                    </tr>
                  ) : (
                    sorted.map(item => (
                      <React.Fragment key={item.id}>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-800">{item.title}</td>
                          <td className="px-6 py-4 text-slate-600 text-sm">{item.author || '-'}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] rounded-full font-bold border border-amber-100 uppercase">
                              {item.genre || '기타'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs font-medium">{format(new Date(item.createdAt), 'yyyy.MM.dd')}</td>
                          {tab === 'completed' && (
                            <td className="px-6 py-4 text-slate-400 text-[10px] font-medium italic">
                              {item.startDate} ~ {item.endDate || ''}
                            </td>
                          )}
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => onDelete(item.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                        {item.memo && tab === 'completed' && (
                          <tr className="bg-amber-50/20">
                            <td colSpan={6} className="px-6 py-3 text-sm text-slate-600 border-b border-slate-100">
                              <div className="flex gap-2 items-start pl-4 border-l-2 border-amber-200">
                                <span className="font-bold text-amber-500 text-[10px] mt-1 shrink-0 uppercase tracking-tighter">My Note</span>
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

export default ReadingManager;
