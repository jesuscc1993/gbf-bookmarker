const { commands, storage, tabs } = chrome;

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

const initialize = () => {
  storage.sync.get('settings', ({ settings }) => {
    if (!settings) {
      fetch('../../../assets/data/defaultSettings.json')
        .then(response => response.json())
        .then(defaultSettings => {
          storage.sync.set({ settings: defaultSettings });
        });
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
          storage.sync.get([key], response => {
            const currentUrl = response[key];
            if (!url.includes(currentUrl)) {
              storage.sync.set({ [key]: url });
            }
          });
        } else if (isAnySubstringIncluded(url, ['/#event', '/#limited'])) {
          // events
          const key = URL_KEYS.EVENT;
          storage.sync.get([key], response => {
            const currentUrl = response[key];
            if (!url.includes(currentUrl)) {
              storage.sync.set({ [key]: url });
            }
          });
        }
      }
    });

    commands.onCommand.addListener(command => {
      tabs.query({ active: true, lastFocusedWindow: true }, matches => {
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
};

const openEvent = tabId => {
  openStoredUrl(tabId, URL_KEYS.EVENT);
};
const openGuildWars = tabId => {
  openStoredUrl(tabId, URL_KEYS.GUILD_WARS);
};
const repeatQuest = tabId => {
  openStoredUrl(tabId, URL_KEYS.LAST_QUEST);
};

const openQuests = tabId => {
  openUrl(tabId, URLS.QUEST);
};
const openParty = tabId => {
  openUrl(tabId, URLS.PARTY);
};

const openStoredUrl = (tabId, key) => {
  storage.sync.get([key], response => {
    const url = response[key];
    if (url) {
      openUrl(tabId, url);
    } else {
      alert('You need to enter once first to store it.');
    }
  });
};

const openUrl = (tabId, url) => {
  tabs.update(tabId, { url });
};

const isAnySubstringIncluded = (string, substrings) => {
  return (
    substrings
      .map(substring => string.includes(substring))
      .filter(included => included).length > 0
  );
};

initialize();