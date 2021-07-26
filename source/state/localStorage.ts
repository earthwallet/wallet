export const saveState = (appState: any) => {
  try {
    const serializedState = JSON.stringify(appState);
    localStorage.setItem('state', serializedState);
  } catch (e) {
    console.error('=> State is stored:', e);
  }
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('<= State is fetched:', e);
    return null;
  }
};
