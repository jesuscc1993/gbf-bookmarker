import { fetchJson } from '../../shared/file.utils.js';
import { getFromStorage, setToStorage } from '../../storage/storage.js';

let _translations;
let _language;

export const supportedLanguages = ['en-us', 'es-es'];

export const initialize = () => {
  return getFromStorage(['language', 'translations']).then((response) => {
    _translations = response.translations;
    _language = response.language;
    return response;
  });
};

export const setLanguage = (language) => {
  if (!supportedLanguages.includes(language)) {
    // throw new Error(`Language ${language} is not supported.`);
    language = supportedLanguages[0];
  }

  return fetchJson(
    `../../../assets/i18n/${language}.json`,
  ).then((translations) => storeLanguageTranslations(language, translations));
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

const storeLanguageTranslations = (language, translations) => {
  return setToStorage({ language, translations });
};

initialize();
