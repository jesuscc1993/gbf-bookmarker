import { downloadFile } from './../../../shared/file.utils.js';
import { getSortedBookmarks } from './../../../shared/settings.utils.js';
import {
  loadSettings,
  removeStoredUrls,
  storeSettings,
} from './../../../storage/settings.storage.js';

const bookmarksForm = jQuery('#bookmarks-form');

const initializeSettings = () => {
  loadSettings().then(settings => {
    fetch('../../../assets/data/bookmarks.json')
      .then(response => response.json())
      .then(bookmarks => {
        getSortedBookmarks(bookmarks, settings).forEach(key => {
          bookmarksForm.append(
            getBookmarkCheckbox(settings, key, bookmarks[key]),
          );
        });
      });
  });

  bookmarksForm.submit(() => submitSettings());
  jQuery('#clear-saved-urls').click(() => clearSavedUrls());
  jQuery('#export-settings').click(() => exportSettings());
  jQuery('#import-settings').click(() => importSettings());
  jQuery('#reset-settings').click(() => resetSettings());
  jQuery('#settings-file-input').on('change', onSettingsFileInputChange);

  new Sortable(bookmarksForm[0], {
    animation: 150,
    ghostClass: 'blue-background-class',
    onUpdate: submitSettings,
  });
};

const applyDefaultSettings = () => {
  fetch('../../../assets/data/defaultSettings.json')
    .then(response => response.json())
    .then(defaultSettings => applySettings(defaultSettings));
};

const applySettings = settings => {
  storeSettings(settings).then(() => location.reload());
};

const clearSavedUrls = () => {
  removeStoredUrls.then(() => alert('Saved URLs have been cleared.'));
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
  return bookmarksForm
    .serializeArray()
    .reduce((formData, field) => ({ ...formData, [field.name]: true }), {});
};

const getFormBookmarksOrder = () => {
  return bookmarksForm
    .find(':checkbox')
    .toArray()
    .map(({ name }) => name);
};

const getFormSettings = () => {
  return {
    bookmarks: getFormBookmarks(),
    bookmarksOrder: getFormBookmarksOrder(),
  };
};

const importSettings = () => {
  if (confirm('Are you sure you want to override you settings?')) {
    document.getElementById('settings-file-input').click();
  }
};

const resetSettings = () => {
  if (confirm('Are you sure you want to reset you settings?')) {
    applyDefaultSettings();
  }
};

const submitSettings = () => {
  storeSettings(getFormSettings()).then(() => reloadPreview());
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

const reloadPreview = () => {
  jQuery('#preview')
    .get(0)
    .contentWindow.location.reload();
};

initializeSettings();
