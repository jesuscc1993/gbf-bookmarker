const targetDomain = 'game.granbluefantasy.jp';

const isAnySubstringIncluded = (string, substrings) => {
  return substrings.map(substring => string.includes(substring)).filter(included => included).length > 0;
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, { url }) => {
  if (changeInfo.status == 'complete' && url.includes(targetDomain)) {
    if (url.includes('/supporter/')) {
      // quests
      chrome.storage.sync.set({ lastQuest: url });
    } else if (url.includes('/#event/teamraid')) {
      // guild wars
      chrome.storage.sync.set({ guildWars: url });
    } else if (isAnySubstringIncluded(url, ['/#event', '/#limited/multi/index/'])) {
      // events
      chrome.storage.sync.set({ event: url });
    }
  }
});
