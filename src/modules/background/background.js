const { commands, storage, tabs } = chrome;

import {
  initialize as initializeTranslations,
  setLanguage,
  translate,
} from '../i18n/i18n.service.js';
import { loadSettings, storeSettings } from '../../storage/settings.storage.js';
import { fetchJson } from '../../shared/file.utils.js';

const targetDomain = 'game.granbluefantasy.jp';

const URL_KEYS = {
  EVENT: 'event',
  GUILD_WARS: 'guildWars',
  LAST_QUEST: 'lastQuest',
};

const URLS = {
  QUEST: `http://${targetDomain}/#quest`,
  PARTY: `http://${targetDomain}/#party/index/0/npc/0`,
};

const initializeBackground = () => {
  loadSettings().then((settings) => {
    if (!settings) {
      fetchJson(
        '../../../assets/data/defaultSettings.json',
      ).then((defaultSettings) => storeSettings(defaultSettings));
    }

    tabs.onUpdated.addListener((tabId, changeInfo, { url }) => {
      if (changeInfo.status == 'complete' && url.includes(targetDomain)) {
        if (url.includes('/supporter/')) {
          // quests
          const key = URL_KEYS.LAST_QUEST;
          storage.sync.set({ [key]: url });
        } else if (url.includes('/#event/teamraid')) {
          // guild wars
          const key = URL_KEYS.GUILD_WARS;
          storage.sync.get([key], (response) => {
            const currentUrl = response[key];
            if (!url.includes(currentUrl)) {
              storage.sync.set({ [key]: url });
            }
          });
        } else if (isAnySubstringIncluded(url, ['/#event', '/#limited'])) {
          // events
          const key = URL_KEYS.EVENT;
          storage.sync.get([key], (response) => {
            const currentUrl = response[key];
            if (!url.includes(currentUrl)) {
              storage.sync.set({ [key]: url });
            }
          });
        }
      }
    });

    commands.onCommand.addListener((command) => {
      tabs.query({ active: true, lastFocusedWindow: true }, (matches) => {
        const firstmatch = matches.find(({ url }) =>
          url.includes(targetDomain),
        );

        if (firstmatch) {
          const action = {
            'open-event': openEvent,
            'open-guild-wars': openGuildWars,
            'open-party': openParty,
            'open-quests': openQuests,
            'repeat-quest': repeatQuest,
          }[command];
          action && action(firstmatch.id);
        }
      });
    });
  });

  initializeTranslations().then(({ language }) => {
    setLanguage(language || navigator.language.toLowerCase());

    chrome.contextMenus.create({
      title: translate('developed_by'),
      contexts: ['browser_action'],
      onclick: () => {
        window.open('https://github.com/jesuscc1993');
      },
    });
    chrome.contextMenus.create({
      title: translate('about_extension'),
      contexts: ['browser_action'],
      onclick: () => {
        window.open('https://github.com/jesuscc1993/gbf-bookmarker');
      },
    });
  });
};

const openEvent = (tabId) => {
  openStoredUrl(tabId, URL_KEYS.EVENT);
};
const openGuildWars = (tabId) => {
  openStoredUrl(tabId, URL_KEYS.GUILD_WARS);
};
const repeatQuest = (tabId) => {
  openStoredUrl(tabId, URL_KEYS.LAST_QUEST);
};

const openQuests = (tabId) => {
  openUrl(tabId, URLS.QUEST);
};
const openParty = (tabId) => {
  openUrl(tabId, URLS.PARTY);
};

const openStoredUrl = (tabId, key) => {
  storage.sync.get([key], (response) => {
    const url = response[key];
    if (url) {
      openUrl(tabId, url);
    } else {
      alert(translate('missing_stored_url'));
    }
  });
};

const openUrl = (tabId, url) => {
  tabs.update(tabId, { url });
};

const isAnySubstringIncluded = (string, substrings) => {
  return (
    substrings
      .map((substring) => string.includes(substring))
      .filter((included) => included).length > 0
  );
};

initializeBackground();
