import { getFromStorage, setToStorage } from './storage.js';

export const loadStyles = () => getFromStorage('styles');

export const storeStyles = settings => setToStorage('styles', settings);
