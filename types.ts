
// Hobby category types
export type Category = 'reading' | 'movie' | 'knitting' | 'baking' | 'exercise';

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

export interface KnittingActivity extends BaseActivity {
  pattern?: string;
  yarn?: string;
  needleType: string;
  needleSize?: string;
}

export interface BakingActivity extends BaseActivity {
  scaling?: string;
  ovenTemp?: string;
  ovenTime?: string;
  recipe?: string;
  link?: string;
}

export interface ExerciseActivity extends BaseActivity {
  type: string;
  time?: string;
  memo?: string;
}

export type Activity = 
  | ReadingActivity 
  | MovieActivity
  | KnittingActivity
  | BakingActivity
  | ExerciseActivity;

export type ViewMode = 'calendar' | Category | 'settings';

export interface CloudSettings {
  dbUrl: string;
  dbKey: string;
  lastSyncedAt?: string;
}
