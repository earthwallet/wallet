export type AppStatusType = 'none' | 'loading' | 'error';

export interface AppStateProps {
  version: string;
  status: AppStatusType;
}
