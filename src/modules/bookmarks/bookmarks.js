import { getSortedBookmarks } from '../../shared/settings.utils.js';
import { translate } from '../../modules/i18n/i18n.service.js';
import { fetchJson } from '../../shared/file.utils.js';

const { storage, tabs } = chrome;

const baseUrl = 'http://game.granbluefantasy.jp';

const initializeBookmarks = () => {
  storage.sync.get(['settings', 'styles'], ({ settings, styles }) => {
    jQuery(`<style>${styles}</style>`).appendTo('head');

    fetchJson('../../../assets/data/bookmarks.json').then((bookmarks) => {
      const bookmarksContainer = jQuery('#bookmarks-container');
      getSortedBookmarks(bookmarks, settings).forEach((key) => {
        const bookmark = bookmarks[key];
        let bookmarksElement;

        if (
          bookmark &&
          bookmark.enabled !== false &&
          settings &&
          settings.bookmarks[key]
        ) {
          if (bookmark.custom) {
            bookmarksElement = getCustomBookmark(key);
          } else if (bookmark.children) {
            bookmarksElement = getBookmarksGroup(key, bookmark);
          } else {
            bookmarksElement = getSingleBookmark(key, bookmark);
          }
        }
        if (bookmarksElement) {
          bookmarksContainer.append(bookmarksElement);
        }
      });
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
  storage.sync.get([key], (response) => {
    const url = response[key];
    if (url) {
      onUrlClick(event, url);
    } else {
      alert(translate('missing_stored_url'));
    }
  });
};

const getCustomBookmark = (key) => {
  switch (key) {
    case 'clock': {
      return getClock(new Date());
    }

    case 'clock-jst': {
      const jstDate = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Japan' }),
      );

      return getClock(jstDate, '(JST)');
    }

    case 'options': {
      const settingsItem = jQuery(
        `<li class="option"><a>${translate('options')}</a></li>`,
      );

      settingsItem.click(() =>
        tabs.create({ url: `src/modules/options/options.html` }),
      );

      return settingsItem;
    }
  }
};

const getClock = (date, suffix) => {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const formattedDate = `${hour}:${minutes > 9 ? minutes : '0' + minutes}`;

  const timeItem = jQuery(
    `<li class="option disabled"><i>${formattedDate}${
      suffix ? ` ${suffix}` : ''
    }</i></li>`,
  );
  return timeItem;
};

const getSingleBookmark = (literal, bookmark) => {
  if (bookmark === null) return jQuery(`<li class="option"></li>`);

  const { children, element, url, urlKey } = bookmark;

  const bookmarkElement = jQuery(
    `<li class="option"><a>${translate(literal)}</a></li>`,
  );

  if (children) {
    bookmarkElement.addClass('toggle');
  }
  if (element) {
    bookmarkElement.addClass(`${element} element`);
  }

  if (!inPreviewMode()) {
    if (url) {
      const fullUrl = url.includes('http') ? url : `${baseUrl}${url}`;
      bookmarkElement.mousedown((event) => onUrlClick(event, fullUrl));
    } else if (urlKey) {
      bookmarkElement.mousedown((event) => onStoredUrlClick(event, urlKey));
    } else if (url === '') {
      bookmarkElement.mousedown(() => alert(translate('tbi')));
    }
  }

  return bookmarkElement;
};

const getBookmarksGroup = (key, bookmark) => {
  const { children } = bookmark;

  const containerElement = $(`<ul></ul>`);
  containerElement.append(
    Object.keys(children).map((nestedKey) =>
      getSingleBookmark(nestedKey, children[nestedKey]),
    ),
  );

  const groupElement = jQuery(`<li class="bookmark-group"></li>`);
  groupElement.append(getSingleBookmark(key, bookmark));
  groupElement.append(containerElement);
  return groupElement;
};

const inPreviewMode = () => {
  return location.search.includes('preview=true');
};

initializeBookmarks();
