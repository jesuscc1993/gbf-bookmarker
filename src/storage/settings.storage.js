import { getFromStorage, setToStorage } from './storage.js';

export const loadSettings = () => getFromStorage('settings');

export const storeSettings = settings => setToStorage('settings', settings);
