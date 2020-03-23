const URL_KEYS = {
  EVENT: 'event',
  GUILD_WARS: 'guildWars',
  LAST_QUEST: 'lastQuest',
};

const initializeSettings = () => {
  loadSettings().then(settings => {
    jQuery.getJSON('../../assets/data/bookmarks.json', bookmarks => {
      const bookmarksContainer = jQuery('#bookmarks-container');
      Object.keys(bookmarks).forEach(key => {
        bookmarksContainer.append(
          getBookmarkCheckbox(settings, key, bookmarks[key]),
        );
      });
    });
  });

  jQuery('#bookmarks-container').submit(() => submitSettings());
  jQuery('#clear-saved-urls').click(() => clearSavedUrls());
  jQuery('#export-settings').click(() => exportSettings());
  jQuery('#import-settings').click(() => importSettings());
  jQuery('#reset-settings').click(() => resetSettings());
  jQuery('#settings-file-input').on('change', onSettingsFileInputChange);
};

const applyDefaultSettings = () => {
  fetch('../../assets/data/defaultSettings.json')
    .then(response => response.json())
    .then(defaultSettings => applySettings(defaultSettings));
};

const applySettings = settings => {
  storeSettings(settings).then(() => location.reload());
};

const clearSavedUrls = () => {
  storage.sync.remove([
    URL_KEYS.EVENT,
    URL_KEYS.GUILD_WARS,
    URL_KEYS.LAST_QUEST,
  ]);
  alert('Saved URLs have been cleared.');
};

const exportSettings = () => {
  downloadFile(
    JSON.stringify(getFormSettings(), undefined, 2),
    'gbf-bookmarker-settings.json',
    'text/plain',
  );
};

const getBookmarkCheckbox = (settings, bookmarkKey, bookmarks) => {
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

const getFormBookmarks = () => {
  return jQuery('form')
    .serializeArray()
    .reduce((formData, field) => ({ ...formData, [field.name]: true }), {});
};

const getFormSettings = () => {
  return {
    bookmarks: getFormBookmarks(),
  };
};

const importSettings = () => {
  var confirmed = confirm('Are you sure you want to override you settings?');
  if (confirmed) {
    document.getElementById('settings-file-input').click();
  }
};

const resetSettings = () => {
  var confirmed = confirm('Are you sure you want to reset you settings?');
  if (confirmed) {
    applyDefaultSettings();
  }
};

const submitSettings = () => {
  storage.sync.set({
    settings: getFormSettings(),
  });
  reloadPreview();
};

const onSettingsFileInputChange = ({ target }) => {
  const reader = new FileReader();
  reader.onload = ({ target }) => {
    try {
      const settings = JSON.parse(target.result);
      applySettings(settings);
    } catch {
      alert('ERROR: Invalid settings format.');
    }
  };
  reader.readAsText(target.files[0]);
};

initializeSettings();
