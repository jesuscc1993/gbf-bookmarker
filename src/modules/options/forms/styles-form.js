import { downloadFile } from './../../../shared/file.utils.js';
import { loadStyles, storeStyles } from './../../../storage/styles.storage.js';
import { translate } from '../../i18n/i18n.service.js';

let stylesEditor;

const initializeStyles = () => {
  loadStyles().then((styles) => {
    const stylesTextarea = jQuery('#styles');
    if (styles) stylesTextarea.val(styles);
    stylesEditor = CodeMirror.fromTextArea(stylesTextarea[0], {
      lineNumbers: true,
      tabSize: 2,
      mode: 'css',
    });
  });

  jQuery('#apply-styles').click(() => applyStyles());
  jQuery('#export-styles').click(() => exportStyles());
  jQuery('#import-styles').click(() => importStyles());
  jQuery('#reset-styles').click(() => resetStyles());
  jQuery('#styles-file-input').change(onStylesFileInputChange);
};

const applyStyles = (styles = getFormStyles()) => {
  storeStyles(styles).then(() => location.reload());
};

const exportStyles = () => {
  downloadFile(getFormStyles(), 'gbf-bookmarker-styles.css', 'text/plain');
};

const getFormStyles = () => {
  return stylesEditor.getValue();
};

const importStyles = () => {
  const formHasValue = getFormStyles();
  if (!formHasValue || confirm(translate('confirm_styles_override'))) {
    document.getElementById('styles-file-input').click();
  }
};

const resetStyles = () => {
  if (confirm(translate('confirm_styles_reset'))) {
    applyStyles('');
  }
};

const onStylesFileInputChange = ({ target }) => {
  const reader = new FileReader();
  reader.onload = ({ target }) => applyStyles(target.result);
  reader.readAsText(target.files[0]);
};

initializeStyles();
