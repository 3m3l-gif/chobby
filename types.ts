export type Category = 'reading' | 'movie' | 'knitting' | 'baking' | 'exercise';
export type ViewMode = 'calendar' | Category | 'settings';

export interface BaseActivity {
  id: string;
  date: string; // App.tsx에서 사용하는 날짜 필드
  category: Category;
  memo?: string;
}

export interface ReadingActivity extends BaseActivity {
  category: 'reading';
  title: string;
  author?: string;
}

export interface MovieActivity extends BaseActivity {
  category: 'movie';
  title: string;
  platform?: string;
}

export interface KnittingActivity extends BaseActivity {
  category: 'knitting';
  item: string; // App.tsx 호환용
}

export interface BakingActivity extends BaseActivity {
  category: 'baking';
  menu: string; // App.tsx 호환용
}

export interface ExerciseActivity extends BaseActivity {
  category: 'exercise';
  type: string;
  duration: string; // App.tsx 호환용
}

export type Activity = 
  | ReadingActivity 
  | MovieActivity 
  | KnittingActivity 
  | BakingActivity 
  | ExerciseActivity;
