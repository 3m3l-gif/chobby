import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Film, Scissors, Cookie, Dumbbell, 
  Calendar as CalendarIcon, Settings as SettingsIcon,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// 메인 앱 컴포넌트
const App = () => {
  const [activities, setActivities] = useState([]);
  const [currentView, setCurrentView] = useState('calendar');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 로컬 스토리지 데이터 로드
  useEffect(() => {
    const savedData = localStorage.getItem('chobby_data');
    if (savedData) {
      try { setActivities(JSON.parse(savedData)); } catch (e) { console.error(e); }
    }
  }, []);

  const categories = [
    { id: 'calendar', name: '달력', icon: CalendarIcon, color: 'bg-slate-500' },
    { id: 'reading', name: '독서', icon: BookOpen, color: 'bg-amber-500' },
    { id: 'movie', name: '영화', icon: Film, color: 'bg-indigo-500' },
    { id: 'knitting', name: '뜨개질', icon: Scissors, color: 'bg-rose-500' },
    { id: 'baking', name: '베이킹', icon: Cookie, color: 'bg-orange-500' },
    { id: 'exercise', name: '운동', icon: Dumbbell, color: 'bg-emerald-500' },
    { id: 'settings', name: '설정', icon: SettingsIcon, color: 'bg-slate-700' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* 사이드바 */}
      <aside className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          {!isSidebarCollapsed && <h1 className="text-xl font-bold text-indigo-600">Chobby</h1>}
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-1 hover:bg-slate-100 rounded">
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCurrentView(cat.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all ${
                currentView === cat.id ? `${cat.color} text-white` : 'text-slate-500 hover:bg-slate-100'
              } ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}
            >
              <cat.icon size={20} />
              {!isSidebarCollapsed && <span className="font-medium">{cat.name}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* 메인 화면 */}
      <main className="flex-1 flex flex-col p-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-20 text-center">
          <h2 className="text-3xl font-bold text-slate-800">"{categories.find(c => c.id === currentView)?.name}" 화면 준비 중</h2>
          <p className="mt-4 text-slate-500 text-lg">기록된 활동: {activities.length}개</p>
          <div className="mt-10 p-6 bg-indigo-50 rounded-xl text-indigo-700 font-medium inline-block">
            성공적으로 연결되었습니다! 이제 각 기능을 구현한 컴포넌트를 추가하면 됩니다.
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
