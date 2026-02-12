
export type Category = 'reading' | 'movie' | 'baking' | 'knitting' | 'exercise';

export interface BaseActivity {
  id: string;
  category: Category;
  title: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  isCompleted: boolean;
}

export interface ReadingActivity extends BaseActivity {
  author?: string;
  genre?: string;
  memo?: string;
}

export interface MovieActivity extends BaseActivity {
  platform?: string;
  memo?: string;
}

export interface BakingActivity extends BaseActivity {
  scaling?: string;
  ovenTemp?: string;
  ovenTime?: string;
  recipe?: string;
  link?: string;
}

// Added KnittingActivity to resolve error in KnittingManager.tsx
export interface KnittingActivity extends BaseActivity {
  pattern?: string;
  yarn?: string;
  needleType?: string;
  needleSize?: string;
}

// Added ExerciseActivity to resolve error in ExerciseManager.tsx
export interface ExerciseActivity extends BaseActivity {
  type?: string;
  time?: string;
  memo?: string;
}

export type Activity = 
  | ReadingActivity 
  | MovieActivity 
  | BakingActivity
  | KnittingActivity
  | ExerciseActivity;

export type ViewMode = 'calendar' | Category | 'settings';
