import { getFromStorage, setToStorage } from './storage.js';

export const URL_KEYS = {
  EVENT: 'event',
  GUILD_WARS: 'guildWars',
  LAST_QUEST: 'lastQuest',
};

export const loadSettings = () => {
  return getFromStorage(['settings']).then(({ settings }) => settings);
};

export const storeSettings = (settings) => {
  return setToStorage({ settings }).then(({ settings }) => settings);
};

export const removeStoredUrls = () => {
  return removeFromStorage([
    URL_KEYS.EVENT,
    URL_KEYS.GUILD_WARS,
    URL_KEYS.LAST_QUEST,
  ]);
};
