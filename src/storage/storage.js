const getFromStorage = key => {
  return new Promise(resolve => {
    storage.sync.get([key], response => resolve(response[key]));
  });
};

const setToStorage = (key, value) => {
  return new Promise(resolve => {
    storage.sync.set({ [key]: value }, () => resolve(value));
  });
};
