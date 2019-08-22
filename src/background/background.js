const { storage, tabs } = chrome;

const targetDomain = 'game.granbluefantasy.jp';

const initialize = () => {
  storage.sync.get(['settings'], ({ settings }) => {
    if (!settings) {
      fetch('../../assets/data/defaultBookmarkSettings.json')
        .then(response => response.json())
        .then(defaultBookmarkSettings => {
          storage.sync.set({ settings: { bookmarks: defaultBookmarkSettings } });
        });
    }

    tabs.onUpdated.addListener((tabId, changeInfo, { url }) => {
      if (changeInfo.status == 'complete' && url.includes(targetDomain)) {
        if (url.includes('/supporter/')) {
          // quests
          storage.sync.set({ lastQuest: url });
        } else if (url.includes('/#event/teamraid')) {
          // guild wars
          storage.sync.get(['guildWars'], response => {
            const currentUrl = response.guildWars;
            if (!url.includes(currentUrl)) {
              storage.sync.set({ guildWars: url });
            }
          });
        } else if (isAnySubstringIncluded(url, ['/#event', '/#limited'])) {
          // events
          storage.sync.get(['event'], response => {
            const currentUrl = response.event;
            if (!url.includes(currentUrl)) {
              storage.sync.set({ event: url });
            }
          });
        }
      }
    });
  });
};

const isAnySubstringIncluded = (string, substrings) => {
  return substrings.map(substring => string.includes(substring)).filter(included => included).length > 0;
};

initialize();
