import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTheme } from '.';
import { AppState } from '../store';
import { AppThemeType } from './types';

export function useToggleTheme() {
  const { theme } = useSelector((state: AppState) => state.app);
  const dispatch = useDispatch();
  const toggleTheme = useCallback(
    (state: AppThemeType) =>
      dispatch(updateTheme(state === 'dark' ? 'light' : 'dark')),
    []
  );

  return [theme, toggleTheme];
}
