
import React, { useState } from 'react';
import { Activity, ExerciseActivity } from '../types';
import { Plus, Trash2, Dumbbell, Calendar, Clock, FileText, List, PenTool } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  activities: ExerciseActivity[];
  onAdd: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Activity>) => void;
}

const ExerciseManager: React.FC<Props> = ({ activities, onAdd, onDelete }) => {
  const [activeMode, setActiveMode] = useState<'record' | 'list'>('list');
  const [formData, setFormData] = useState({
    title: '', 
    startDate: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    memo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate) return;

    const newActivity: ExerciseActivity = {
      id: crypto.randomUUID(),
      category: 'exercise',
      title: formData.title,
      type: formData.title,
      startDate: formData.startDate,
      endDate: formData.startDate, 
      time: formData.time,
      memo: formData.memo,
      createdAt: new Date().toISOString(),
      isCompleted: true
    };

    onAdd(newActivity);
    setFormData({ title: '', startDate: format(new Date(), 'yyyy-MM-dd'), time: '', memo: '' });
    setActiveMode('list');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">운동 일지</h2>
          <p className="text-slate-500">매일매일의 운동 기록을 남겨보세요.</p>
        </div>
        
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveMode('record')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeMode === 'record' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
          >
            <PenTool size={16} /> 기록하기
          </button>
          <button 
            onClick={() => setActiveMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeMode === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
          >
            <List size={16} /> 목록보기
          </button>
        </div>
      </div>

      {activeMode === 'record' ? (
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-600">
              <Plus size={24} />
              새 운동 기록
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">운동 종류 <span className="text-emerald-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
                  placeholder="예: 조깅, 요가, 헬스"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">날짜</label>
                <input 
                  type="date" 
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">운동 시간</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="예: 30분, 1시간"
                  />
                  <Clock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">메모</label>
                <textarea 
                  value={formData.memo}
                  onChange={e => setFormData({...formData, memo: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  rows={4}
                  placeholder="오늘의 운동 컨디션이나 특이사항을 남겨보세요."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-100 text-lg"
              >
                운동 완료 저장
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.length === 0 ? (
            <div className="col-span-full bg-white p-16 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
              <Dumbbell className="mx-auto mb-4 opacity-10" size={64} />
              아직 운동 기록이 없습니다.
            </div>
          ) : (
            [...activities].reverse().map(item => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group relative hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Dumbbell size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 tracking-tight">{item.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mt-1">
                        <Calendar size={12} />
                        <span>{item.startDate}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => onDelete(item.id)} className="text-slate-300 hover:text-rose-500 p-2 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  {item.time && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 font-bold bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                      <Clock size={14} />
                      <span>{item.time}</span>
                    </div>
                  )}
                  {item.memo && (
                    <div className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <FileText size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      <p className="leading-relaxed">{item.memo}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseManager;
