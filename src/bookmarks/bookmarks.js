const { storage, tabs } = chrome;

const baseUrl = 'http://game.granbluefantasy.jp';

const initialize = () => {
  storage.sync.get(['settings'], ({ settings }) => {
    jQuery.getJSON('../../assets/data/bookmarks.json', bookmarks => {
      Object.keys(bookmarks).forEach(key => {
        const bookmark = bookmarks[key];
        let bookmarksElement;

        if (!!settings.bookmarks[key]) {
          if (bookmark.url || bookmark.urlKey) {
            bookmarksElement = getSingleBookmark(key, bookmark);
          } else {
            bookmarksElement = getBookmarksGroup(key, bookmark);
          }
        }
        if (bookmarksElement) jQuery('#bookmarks').append(bookmarksElement);
      });

      const jstDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Japan' }));
      const hour = jstDate.getHours();
      const minutes = jstDate.getMinutes();
      const formattedDate = `${hour}:${minutes > 9 ? minutes : '0' + minutes}`;

      const settingsItem = jQuery(`<li class="option"><a>Settings</a></li>`);
      settingsItem.click(() => tabs.create({ url: `src/options/options.html` }));
      jQuery('#bookmarks').append(settingsItem);

      const timeItem = jQuery(`<li class="option disabled"><i>${formattedDate} (JST)</i></li>`);
      jQuery('#bookmarks').append(timeItem);
    });
  });
};

const onUrlClick = (event, url) => {
  ({
    1: () => {
      tabs.update({ active: true, url });
      window.close();
    },
    2: () => {
      tabs.create({ url });
    },
  }[event.which]());
};

const onStoredUrlClick = (event, key) => {
  storage.sync.get([key], response => {
    const url = response[key];
    if (url) {
      onUrlClick(event, url);
    } else {
      alert('You need to enter once first to store it.');
    }
  });
};

const getRaidBookmark = ({ element, raidId, raidSubId }) => {
  let url = `/#quest/supporter/${raidId}1/1`;
  if (raidSubId) url += `/0/${raidSubId}`;
  return { element, url };
};

const getSingleBookmark = (key, bookmark) => {
  const { element, url, urlKey } = bookmark.raidId ? getRaidBookmark(bookmark) : bookmark;
  const domElement = jQuery(`<li class="option"><a>${key}</a></li>`);
  if (element) {
    domElement.addClass(`${element} element`);
  }
  if (url) {
    const fullUrl = url.includes('http') ? url : `${baseUrl}${url}`;
    domElement.mousedown(event => onUrlClick(event, fullUrl));
  }
  if (urlKey) {
    domElement.mousedown(event => onStoredUrlClick(event, urlKey));
  }
  return domElement;
};

const getBookmarksGroup = (key, bookmark) => {
  const container = jQuery(`
    <li class="bookmark-group">
      <span class="option toggle">
        ${key}
      </span>
      <ul></ul>
    </li>`);
  container.find('ul').append(Object.keys(bookmark).map(nestedKey => getSingleBookmark(nestedKey, bookmark[nestedKey])));
  return container;
};

initialize();
