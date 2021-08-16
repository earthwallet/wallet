export type AppStatusType = 'none' | 'loading' | 'error';

export type AppThemeType = 'light' | 'dark';

export interface IAppState {
  version: string;
  status: AppStatusType;
  theme: AppThemeType;
  hydrated: boolean;
  hydrating: boolean;
}
