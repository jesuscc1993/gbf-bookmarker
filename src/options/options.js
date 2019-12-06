const { storage, tabs } = chrome;

let settings = {};

const initialize = () => {
  storage.sync.get(['settings'], response => {
    settings = response.settings;

    jQuery.getJSON('../../assets/data/bookmarks.json', bookmarks => {
      const bookmarksContainer = jQuery('#bookmarks-container');
      Object.keys(bookmarks).forEach(key => {
        bookmarksContainer.append(getCheckbox(key, bookmarks[key]));
      });
    });
  });

  jQuery('form').submit(submitSettings);
};

const getCheckbox = (bookmarkKey, bookmarks) => {
  const id = bookmarkKey.toLowerCase().replace(/ /g, '_');

  const checkbox = jQuery(
    `<input id="${id}" name="${bookmarkKey}" type="checkbox">`,
  );
  checkbox.change(submitSettings);
  if (settings && settings.bookmarks[bookmarkKey]) {
    checkbox.attr('checked', 'checked');
  }

  const label = jQuery(`<label for="${id}">${bookmarkKey}</label>`);
  const childBookmarkKeys = Object.keys(bookmarks);
  const hasChildBookmarks =
    !bookmarks.url && !bookmarks.urlKey && childBookmarkKeys.length;
  if (hasChildBookmarks) {
    label.attr('title', childBookmarkKeys.join(', '));
  }

  const p = jQuery(`<p>`);
  p.append(checkbox);
  p.append(label);
  return p;
};

const submitSettings = () => {
  storage.sync.set({
    settings: {
      bookmarks: jQuery('form')
        .serializeArray()
        .reduce((formData, field) => ({ ...formData, [field.name]: true }), {}),
    },
  });
  jQuery('#preview')
    .get(0)
    .contentWindow.location.reload();
};

initialize();
