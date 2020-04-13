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

        if (bookmark && settings && settings.bookmarks[key]) {
          if (bookmark.children) {
            bookmarksElement = getBookmarksGroup(key, bookmark);
          } else {
            bookmarksElement = getSingleBookmark(key, bookmark);
          }
        }
        if (bookmarksElement) {
          bookmarksContainer.append(bookmarksElement);
        }
      });

      const jstDate = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Japan' }),
      );
      const hour = jstDate.getHours();
      const minutes = jstDate.getMinutes();
      const formattedDate = `${hour}:${minutes > 9 ? minutes : '0' + minutes}`;

      const settingsItem = jQuery(
        `<li class="option"><a>${translate('options')}</a></li>`,
      );
      settingsItem.click(() =>
        tabs.create({ url: `src/modules/options/options.html` }),
      );
      bookmarksContainer.append(settingsItem);

      const timeItem = jQuery(
        `<li class="option disabled"><i>${formattedDate} (JST)</i></li>`,
      );
      bookmarksContainer.append(timeItem);
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

const getSingleBookmark = (literal, bookmark) => {
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
  if (url && !inPreviewMode()) {
    const fullUrl = url.includes('http') ? url : `${baseUrl}${url}`;
    bookmarkElement.mousedown((event) => onUrlClick(event, fullUrl));
  }
  if (urlKey && !inPreviewMode()) {
    bookmarkElement.mousedown((event) => onStoredUrlClick(event, urlKey));
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
