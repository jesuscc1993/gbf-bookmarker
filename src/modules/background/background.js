const { commands, storage, tabs } = chrome;

import {
  initialize as initializeTranslations,
  setLanguage,
  translate,
} from '../i18n/i18n.service.js';
import { loadSettings, storeSettings } from '../../storage/settings.storage.js';
import { fetchJson } from '../../shared/file.utils.js';

const initializeBackground = () => {
  loadSettings().then((settings) => {
    if (!settings) {
      fetchJson('../../../assets/data/defaultSettings.json').then(
        (defaultSettings) => storeSettings(defaultSettings),
      );
    }

    tabs.onUpdated.addListener((tabId, changeInfo, { url }) => {
      if (changeInfo.status == 'complete' && url.includes(targetDomain)) {
        if (url.includes('/supporter/')) {
          // quests
          const key = UrlKeys.LastQuest;
          storage.sync.set({ [key]: url });
        } else if (url.includes('/#event/teamraid')) {
          // guild wars
          const key = UrlKeys.GuildWars;
          storage.sync.get([key], (response) => {
            const currentUrl = response[key];
            if (!url.includes(currentUrl)) {
              storage.sync.set({ [key]: url });
            }
          });
        } else if (isAnySubstringIncluded(url, ['/#event', '/#limited'])) {
          // events
          const key = UrlKeys.Event;
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
            [ShortcutAction.Arcarum]: openArcarum,
            [ShortcutAction.Event]: openEvent,
            [ShortcutAction.FateEpisodes]: openFate,
            [ShortcutAction.GuildWars]: openGuildWars,
            [ShortcutAction.Party]: openParty,
            [ShortcutAction.Quests]: openQuests,
            [ShortcutAction.Raids]: openRaids,
            [ShortcutAction.RepeatQuest]: repeatQuest,
            [ShortcutAction.World]: openWorld,
          }[command];
          action && action(firstmatch.id);
        }
      });
    });
  });

  initializeTranslations().then(({ language }) => {
    setLanguage(language || navigator.language.toLowerCase()).then(() => {
      chrome.contextMenus.create({
        id: ContextMenuItem.About,
        title: translate('about_extension'),
        contexts: ['all'],
      });
      chrome.contextMenus.create({
        id: ContextMenuItem.Issues,
        title: translate('open_issue'),
        contexts: ['all'],
      });
      chrome.contextMenus.create({
        id: ContextMenuItem.Developer,
        title: translate('developed_by'),
        contexts: ['all'],
      });
      chrome.contextMenus.onClicked.addListener((info, tab) => {
        const action = {
          [ContextMenuItem.About]: openAbout,
          [ContextMenuItem.Developer]: openDeveloper,
          [ContextMenuItem.Issues]: openIssues,
        }[info.menuItemId];
        action && action();
      });
    });
  });
};

const openEvent = (tabId) => openStoredUrl(tabId, UrlKeys.Event);
const openGuildWars = (tabId) => openStoredUrl(tabId, UrlKeys.GuildWars);
const repeatQuest = (tabId) => openStoredUrl(tabId, UrlKeys.LastQuest);

const openArcarum = (tabId) => openUrl(tabId, Urls.Arcarum);
const openFate = (tabId) => openUrl(tabId, Urls.FateEpisodes);
const openParty = (tabId) => openUrl(tabId, Urls.Party);
const openQuests = (tabId) => openUrl(tabId, Urls.Quest);
const openRaids = (tabId) => openUrl(tabId, Urls.Raids);
const openWorld = (tabId) => openUrl(tabId, Urls.World);

const openAbout = () => openTab(Urls.About);
const openDeveloper = () => openTab(Urls.Developer);
const openIssues = () => openTab(Urls.Issues);

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
const openTab = (url) => {
  tabs.create({ url });
};

const isAnySubstringIncluded = (string, substrings) => {
  return (
    substrings
      .map((substring) => string.includes(substring))
      .filter((included) => included).length > 0
  );
};

const targetDomain = 'game.granbluefantasy.jp';

const UrlKeys = {
  Event: 'event',
  GuildWars: 'guildWars',
  LastQuest: 'lastQuest',
};

const Urls = {
  Arcarum: `https://${targetDomain}/#arcarum2`,
  FateEpisodes: `https://${targetDomain}/#quest/fate`,
  Party: `https://${targetDomain}/#party/index/0/npc/0`,
  Quest: `https://${targetDomain}/#quest`,
  Raids: `https://${targetDomain}/#quest/assist`,
  World: `https://${targetDomain}/#quest/island`,

  About: `https://github.com/jesuscc1993/gbf-bookmarker#gbf-bookmarker`,
  Developer: `https://github.com/jesuscc1993`,
  Issues: `https://github.com/jesuscc1993/gbf-bookmarker/issues`,
};

const ShortcutAction = {
  Arcarum: 'open-arcarum',
  Event: 'open-event',
  FateEpisodes: 'open-fate-episodes',
  GuildWars: 'open-guild-wars',
  Party: 'open-party',
  Quests: 'open-quests',
  Raids: 'open-raids',
  RepeatQuest: 'repeat-quest',
  World: 'open-world',
};

const ContextMenuItem = {
  About: 'gbf-bookmarker-about',
  Developer: 'gbf-bookmarker-developer',
  Issues: 'gbf-bookmarker-issues',
};

initializeBackground();
