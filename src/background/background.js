const { storage, tabs } = chrome;

const targetDomain = 'game.granbluefantasy.jp';

const defaultBookmarkSettings = {
  Home: true,
  'Repeat Quest': true,
  'Guild Wars': true,
  Event: true,
  Party: true,
  Me: true,
  Inventory: false,
  Upgrade: false,
  Items: true,
  'Co-op': true,
  Shop: true,
  Casino: true,
  Draw: true,
  Quests: true,
  'H Raids': true,
  'H+ Raids': true,
  'M1 Raids': true,
  'M1 HL Raids': true,
  'M2 HL Raids': true,
  'T1 Summons': false,
  'T2 Summons': false,
  Trials: true,
  Extra: true,
};

const initialize = () => {
  storage.sync.get(['settings'], ({ settings }) => {
    if (!settings) {
      storage.sync.set({
        settings: { bookmarks: defaultBookmarkSettings },
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
        } else if (isAnySubstringIncluded(url, ['/#event', '/#limited/multi/index/'])) {
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
