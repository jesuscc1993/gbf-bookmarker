import { getSortedBookmarks } from '../../shared/settings.utils.js';
import { translate } from '../../modules/i18n/i18n.service.js';
import { fetchJson } from '../../shared/file.utils.js';
import { getFromStorage } from '../../storage/storage.js';

const { tabs } = chrome;

const baseUrl = 'https://game.granbluefantasy.jp';

const initializeBookmarks = () => {
  getFromStorage(['settings', 'styles']).then(({ settings, styles }) => {
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
  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : url;
  ({
    1: openInCurrentTab,
    2: openInNewTab,
  })[event.which](fullUrl);
};

const openInCurrentTab = (url) => {
  tabs.update({ active: true, url });
  window.close();
};

const openInNewTab = (url) => {
  tabs.create({ url });
};

const onStoredUrlClick = (event, key) => {
  getFromStorage([key]).then((response) => {
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
      const settingsItem = jQuery(`
        <li class="option clickable">
          <a>${translate('options')}</a>
        </li>
      `);

      if (!inPreviewMode()) {
        settingsItem.click(() =>
          tabs.create({ url: `src/modules/options/options.html` }),
        );
      }

      return settingsItem;
    }
  }
};

const getClock = (date, suffix) => {
  const formattedDate = date.toLocaleString('en-US', {
    hour12: true,
    timeStyle: 'short',
  });

  return jQuery(`
    <li class="option">
      <i>${formattedDate}${suffix ? ` ${suffix}` : ''}</i>
    </li>
  `);
};

const getSingleBookmark = (literal, bookmark) => {
  if (bookmark === null) return jQuery(`<li class="option"></li>`);

  const { children, element, title, url, urls, urlKey } = bookmark;
  const clickable = children || url || urlKey;
  const disabled = !(clickable || urls);
  const className = clickable ? 'clickable' : disabled ? 'disabled' : '';

  const bookmarkElement = jQuery(`
    <li
      class="option ${className}"
      title="${translate(title || literal)}"
    >
      ${translate(literal)}
    </li>
  `);

  if (urls) {
    urls.forEach(({ element, url }, i) => {
      const clickable = url;
      const disabled = !clickable;
      const className = clickable ? 'clickable' : disabled ? 'disabled' : '';

      const childElement = jQuery(`
        <span
          class="host-material ${element} ${className}"
          title="${translate(element)}"
        >
      `);

      if (!inPreviewMode()) {
        if (url) {
          childElement.mousedown((event) => onUrlClick(event, url));
        } else if (!url) {
          childElement.mousedown(() => alert(translate('tbi')));
        }
      }
      i % 2 === 0
        ? bookmarkElement.append(childElement)
        : bookmarkElement.prepend(childElement);
    });
  }

  if (children) {
    bookmarkElement.addClass('toggle');
  }
  if (element) {
    bookmarkElement.addClass(element);
  }

  if (!inPreviewMode()) {
    if (url) {
      bookmarkElement.mousedown((event) => onUrlClick(event, url));
    } else if (urlKey) {
      bookmarkElement.mousedown((event) => onStoredUrlClick(event, urlKey));
    } else if (!(urls || children)) {
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
