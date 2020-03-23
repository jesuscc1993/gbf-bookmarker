import { getFromStorage, setToStorage } from './storage.js';

export const loadStyles = () => {
  return getFromStorage(['styles']).then(response => response.styles);
};

export const storeStyles = styles => {
  return setToStorage({ styles }).then(response => response.styles);
};
