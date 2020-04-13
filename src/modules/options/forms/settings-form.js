import { downloadFile, fetchJson } from './../../../shared/file.utils.js';
import { getSortedBookmarks } from './../../../shared/settings.utils.js';
import {
  loadSettings,
  removeStoredUrls,
  storeSettings,
} from './../../../storage/settings.storage.js';
import {
  getLanguage,
  initialize as initializeTranslations,
  setLanguage,
  translate,
} from '../../i18n/i18n.service.js';

const bookmarksForm = jQuery('#bookmarks-form');

const initializeSettingsForm = () => {
  loadSettings().then((settings) => {
    fetchJson('../../../assets/data/bookmarks.json').then((bookmarks) => {
      getSortedBookmarks(bookmarks, settings).forEach((key) => {
        if (bookmarks[key]) {
          bookmarksForm.append(
            getBookmarkCheckbox(settings, key, bookmarks[key]),
          );
        }
      });
    });
  });

  bookmarksForm.submit(() => submitSettings());
  jQuery('#clear-saved-urls').click(() => clearSavedUrls());
  jQuery('#export-settings').click(() => exportSettings());
  jQuery('#import-settings').click(() => importSettings());
  jQuery('#reset-settings').click(() => resetSettings());
  jQuery('#settings-file-input').change(onSettingsFileInputChange);

  initializeTranslations().then(() => {
    jQuery('#language').val(getLanguage());
    jQuery('#language').change(changeLanguage);
  });

  new Sortable(bookmarksForm[0], {
    animation: 150,
    ghostClass: 'blue-background-class',
    onUpdate: submitSettings,
  });
};

const applyDefaultSettings = () => {
  fetchJson('../../../assets/data/defaultSettings.json').then(applySettings);
};

const applySettings = (settings) => {
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

const getBookmarkCheckbox = (settings, bookmarkLiteral, bookmarks) => {
  const id = bookmarkLiteral;

  const checkbox = jQuery(
    `<input id="${id}" name="${bookmarkLiteral}" type="checkbox">`,
  );
  checkbox.change(submitSettings);
  if (settings && settings.bookmarks[bookmarkLiteral]) {
    checkbox.attr('checked', 'checked');
  }

  const label = jQuery(
    `<label for="${id}">${translate(bookmarkLiteral)}</label>`,
  );
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
  if (confirm(translate('confirm_settings_override'))) {
    document.getElementById('settings-file-input').click();
  }
};

const resetSettings = () => {
  if (confirm(translate('confirm_settings_reset'))) {
    applyDefaultSettings();
  }
};

const changeLanguage = ({ target }) => {
  setLanguage(target.value);
  location.reload();
};

const submitSettings = () => {
  storeSettings(getFormSettings()).then(reloadPreview);
};

const onSettingsFileInputChange = ({ target }) => {
  const reader = new FileReader();
  reader.onload = ({ target }) => {
    try {
      const settings = JSON.parse(target.result);
      applySettings(settings);
    } catch {
      alert(translate('invalid_json_format'));
    }
  };
  reader.readAsText(target.files[0]);
};

const reloadPreview = () => {
  jQuery('#preview').get(0).contentWindow.location.reload();
};

initializeSettingsForm();
