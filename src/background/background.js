const { commands, storage, tabs } = chrome;

const targetDomain = 'game.granbluefantasy.jp';

const URL_KEYS = {
  EVENT: 'event',
  GUILD_WARS: 'guildWars',
  LAST_QUEST: 'lastQuest',
};

const initialize = () => {
  storage.sync.get(['settings'], ({ settings }) => {
    if (!settings) {
      fetch('../../assets/data/defaultBookmarkSettings.json')
        .then(response => response.json())
        .then(defaultBookmarkSettings => {
          storage.sync.set({
            settings: { bookmarks: defaultBookmarkSettings },
          });
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
      const action = {
        'open-event': openEvent,
        'open-guild-wars': openGuildWars,
        'repeat-quest': repeatQuest,
      }[command];
      action && action();
    });
  });
};

const openEvent = () => {
  openStoredUrl(URL_KEYS.EVENT);
};
const openGuildWars = () => {
  openStoredUrl(URL_KEYS.GUILD_WARS);
};
const repeatQuest = () => {
  openStoredUrl(URL_KEYS.LAST_QUEST);
};

const openStoredUrl = key => {
  storage.sync.get([key], response => {
    const url = response[key];
    if (url) {
      tabs.update({ active: true, url });
    } else {
      alert('You need to enter once first to store it.');
    }
  });
};

const isAnySubstringIncluded = (string, substrings) => {
  return (
    substrings
      .map(substring => string.includes(substring))
      .filter(included => included).length > 0
  );
};

initialize();
