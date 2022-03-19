importScripts('../../shared/file.utils.js');
importScripts('../../storage/storage.js');

let _translations;
let _language;

export const supportedLanguages = ['en-us', 'es-es'];

export const initialize = () => {
  return getFromStorage(['language', 'translations']).then((response) => {
    _language = response.language;
    _translations = response.translations;
    return response;
  });
};

export const setLanguage = (language) => {
  if (!supportedLanguages.includes(language)) {
    // throw new Error(`Language ${language} is not supported.`);
    language = supportedLanguages[0];
  }

  _language = language;

  return new Promise((resolve) =>
    fetchTranslations(language).then((translations) => {
      _translations = translations;
      storeLanguageTranslations(language, translations);
      resolve();
    }),
  );
};

export const translate = (literal) => {
  return (_translations && _translations[literal]) || `t("${literal}")`;
};

export const getLanguage = () => {
  return _language;
};

export const translateDom = () => {
  _translations ? _translateDom() : initialize().then(_translateDom);
};

const _translateDom = () => {
  jQuery('[translate]').each(
    (i, e) => (e.innerText = translate(jQuery(e).attr('translate'))),
  );
};

const fetchTranslations = (language) => {
  return fetchJson(`../../../assets/i18n/${language}.json`);
};

const storeLanguageTranslations = (language, translations) => {
  return setToStorage({ language, translations });
};

initialize();
