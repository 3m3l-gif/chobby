
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Film, 
  Calendar as CalendarIcon,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Activity, 
  ViewMode, 
  ReadingActivity, 
  MovieActivity, 
  CloudSettings 
} from './types';
import ReadingManager from './components/ReadingManager';
import MovieManager from './components/MovieManager';
import CalendarView from './components/CalendarView';
import SettingsManager from './components/SettingsManager';

const STORAGE_KEY = 'chobby_data';
const SETTINGS_KEY = 'chobby_settings';
const CLOUD_KEY = 'chobby_cloud_meta';
const VALID_CATEGORIES = ['reading', 'movie'];

const DEFAULT_PLATFORMS = ['영화관', '넷플릭스', '티빙', '디즈니+', '왓챠', '쿠팡플레이', '유튜브'];

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('calendar');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [moviePlatforms, setMoviePlatforms] = useState<string[]>(DEFAULT_PLATFORMS);
  const [cloudMeta, setCloudMeta] = useState<CloudSettings>({ dbUrl: '', dbKey: '' });

  // Load data & settings
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    const savedCloud = localStorage.getItem(CLOUD_KEY);
    
    if (savedData) {
      try { 
        const parsed = JSON.parse(savedData);
        setActivities(parsed.filter((a: any) => VALID_CATEGORIES.includes(a.category))); 
      } catch (e) { console.error(e); }
    }
    if (savedSettings) {
      try { setMoviePlatforms(JSON.parse(savedSettings)); } catch (e) { setMoviePlatforms(DEFAULT_PLATFORMS); }
    }
    if (savedCloud) {
      try { setCloudMeta(JSON.parse(savedCloud)); } catch (e) { console.error(e); }
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  // Save settings
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(moviePlatforms));
    localStorage.setItem(CLOUD_KEY, JSON.stringify(cloudMeta));
  }, [moviePlatforms, cloudMeta]);

  const addActivity = (activity: Activity) => {
    setActivities(prev => [...prev, activity]);
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updates } as Activity : a));
  };

  const addPlatform = (name: string) => {
    if (name && !moviePlatforms.includes(name)) {
      setMoviePlatforms(prev => [...prev, name]);
    }
  };

  const deletePlatform = (name: string) => {
    setMoviePlatforms(prev => prev.filter(p => p !== name));
  };

  // Simplified navigation categories
  const categories: { id: ViewMode; name: string; icon: any; color: string }[] = [
    { id: 'calendar', name: '달력', icon: CalendarIcon, color: 'bg-slate-500' },
    { id: 'reading', name: '독서 기록', icon: BookOpen, color: 'bg-amber-500' },
    { id: 'movie', name: '영화 기록', icon: Film, color: 'bg-indigo-500' },
    { id: 'settings', name: '설정/동기화', icon: SettingsIcon, color: 'bg-slate-700' },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView activities={activities} />;
      case 'reading':
        return <ReadingManager 
          activities={activities.filter(a => a.category === 'reading') as ReadingActivity[]} 
          onAdd={addActivity} 
          onDelete={deleteActivity}
          onUpdate={updateActivity}
        />;
      case 'movie':
        return <MovieManager 
          activities={activities.filter(a => a.category === 'movie') as MovieActivity[]} 
          platforms={moviePlatforms}
          onAdd={addActivity} 
          onDelete={deleteActivity}
          onUpdate={updateActivity}
        />;
      case 'settings':
        return <SettingsManager 
          activities={activities} 
          platforms={moviePlatforms}
          cloudMeta={cloudMeta}
          onUpdateCloudMeta={setCloudMeta}
          onAddPlatform={addPlatform}
          onDeletePlatform={deletePlatform}
          onImport={(data) => setActivities(data.filter(a => VALID_CATEGORIES.includes(a.category)))} 
        />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-slate-200 flex flex-col hidden md:flex transition-all duration-300 ease-in-out relative ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className={`p-4 border-b border-slate-100 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2 cursor-pointer overflow-hidden whitespace-nowrap" onClick={() => setCurrentView('calendar')}>
            <div className="min-w-[32px] w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-100 shrink-0">
              <span className="text-white font-bold text-base italic">ch</span>
            </div>
            {!isSidebarCollapsed && <h1 className="text-lg font-bold tracking-tight text-slate-800">Chobby</h1>}
          </div>
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className={`flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-all border border-slate-100 bg-white shadow-sm z-50 ${isSidebarCollapsed ? 'absolute -right-3 top-5 w-6 h-6' : 'w-6 h-6'}`}>
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setCurrentView(cat.id)} className={`w-full flex items-center rounded-lg transition-all duration-200 group ${currentView === cat.id ? `${cat.color} text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'} ${isSidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5 gap-3'}`} title={isSidebarCollapsed ? cat.name : undefined}>
              <cat.icon size={18} className="shrink-0" />
              {!isSidebarCollapsed && <span className="font-medium text-sm whitespace-nowrap">{cat.name}</span>}
            </button>
          ))}
        </nav>
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">My Stats</p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">총 기록</span>
                <span className="font-bold text-slate-900">{activities.length}건</span>
              </div>
            </div>
          </div>
        )}
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between md:hidden">
           <h1 className="text-xl font-bold italic text-indigo-600" onClick={() => setCurrentView('calendar')}>Chobby</h1>
           <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-[200px]">
             {categories.map(cat => (
               <button key={cat.id} onClick={() => setCurrentView(cat.id)} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${currentView === cat.id ? cat.color + ' text-white' : 'text-slate-400'}`} title={cat.name}><cat.icon size={18} /></button>
             ))}
           </div>
        </header>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          <div className="max-w-7xl mx-auto h-full">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
