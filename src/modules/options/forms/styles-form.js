let stylesEditor;

const initializeStyles = () => {
  loadStyles().then(styles => {
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
  jQuery('#styles-file-input').on('change', onStylesFileInputChange);
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
  if (
    !formHasValue ||
    confirm('Are you sure you want to override you styles?')
  ) {
    document.getElementById('styles-file-input').click();
  }
};

const resetStyles = () => {
  if (confirm('Are you sure you want to reset you styles?')) {
    applyStyles('');
  }
};

const onStylesFileInputChange = ({ target }) => {
  const reader = new FileReader();
  reader.onload = ({ target }) => applyStyles(target.result);
  reader.readAsText(target.files[0]);
};

initializeStyles();
