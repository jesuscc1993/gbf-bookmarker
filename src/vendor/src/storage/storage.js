const { storage } = chrome;

export const getFromStorage = keys => {
  return new Promise(resolve => {
    storage.sync.get(keys, response => resolve(response));
  });
};

export const setToStorage = value => {
  return new Promise(resolve => {
    storage.sync.set(value, () => resolve(value));
  });
};

export const removeFromStorage = keys => {
  return new Promise(resolve => {
    storage.sync.remove(keys, () => resolve());
  });
};
