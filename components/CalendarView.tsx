
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Activity } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  activities: Activity[];
}

const CalendarView: React.FC<Props> = ({ activities }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Simplified category colors for Reading and Movie only
  const categoryColors: Record<string, string> = {
    reading: 'bg-amber-100 text-amber-700 border-amber-200',
    movie: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };

  const getDayActivities = (day: Date) => {
    return activities.filter(activity => {
      if (!activity.startDate) return false;
      const start = parseISO(activity.startDate);
      const end = activity.endDate ? parseISO(activity.endDate) : start;
      
      return isWithinInterval(day, { start, end }) || isSameDay(day, start) || isSameDay(day, end);
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col min-h-full">
      <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            {format(currentDate, 'yyyy년 M월', { locale: ko })}
          </h2>
          <p className="text-slate-400 text-[10px] md:text-xs font-medium uppercase tracking-wider">대한민국 표준시(KST)</p>
        </div>
        <div className="flex gap-1 md:gap-2">
          <button 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-1.5 md:p-2 hover:bg-slate-50 rounded-lg border border-slate-200 text-slate-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 md:px-4 py-1.5 md:py-2 hover:bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[10px] md:text-xs font-bold transition-colors"
          >
            오늘
          </button>
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-1.5 md:p-2 hover:bg-slate-50 rounded-lg border border-slate-200 text-slate-600 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="calendar-grid border-b border-slate-100 bg-slate-50/50">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
            <div key={day} className={`py-2 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider ${i === 0 ? 'text-rose-500' : i === 6 ? 'text-indigo-500' : 'text-slate-400'}`}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="flex-1 calendar-grid divide-x divide-y divide-slate-100 overflow-y-auto">
          {days.map((day, i) => {
            const dayActivities = getDayActivities(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div key={i} className={`min-h-[80px] md:min-h-[110px] p-1.5 transition-colors ${!isCurrentMonth ? 'bg-slate-50/30' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-indigo-600 text-white' : 
                    !isCurrentMonth ? 'text-slate-200' : 
                    day.getDay() === 0 ? 'text-rose-400' :
                    day.getDay() === 6 ? 'text-indigo-400' :
                    'text-slate-600'
                  }`}>
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayActivities.map(act => (
                    <div 
                      key={act.id} 
                      className={`text-[8px] md:text-[9px] px-1 py-0.5 rounded border border-opacity-50 truncate font-bold ${categoryColors[act.category] || 'bg-slate-100 text-slate-600 border-slate-200'}`}
                      title={act.title}
                    >
                      {act.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
