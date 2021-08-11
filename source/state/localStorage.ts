export const saveState = (appState: any) => {
  try {
    const serializedState = JSON.stringify(appState);
    localStorage.setItem('state', serializedState);
  } catch (e) {
    console.error('=> State is stored:', e);
  }
};

export const loadState = async () => {
  try {
    const serializedState = await chrome.storage.local.get('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState?.state);
  } catch (e) {
    console.error('<= State is fetched:', e);
    return null;
  }
};
