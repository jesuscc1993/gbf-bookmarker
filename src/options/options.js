const { storage, tabs } = chrome;

let settings = {};

const initialize = () => {
  storage.sync.get(['settings'], response => {
    jQuery.getJSON('../../assets/data/bookmarks.json', bookmarks => {
      settings = response.settings;

      Object.keys(bookmarks).forEach(key => {
        jQuery('#bookmarks').append(getCheckbox(key));
      });
    });
  });

  jQuery('form').submit(submitSettings);
};

const getCheckbox = bookmarkKey => {
  const id = bookmarkKey.toLowerCase().replace(/ /g, '_');

  const checkbox = jQuery(`<input id="${id}" name="${bookmarkKey}" type="checkbox">`);
  if (!!settings.bookmarks[bookmarkKey]) {
    checkbox.attr('checked', 'checked');
  }

  const label = jQuery(`<label for="${id}">${bookmarkKey}</label>`);

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
};

initialize();
