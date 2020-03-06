let stylesEditor;

const initializeStyles = () => {
  storage.sync.get(['styles'], ({ styles }) => {
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
  storage.sync.set({ styles });
  location.reload();
};

const exportStyles = () => {
  downloadFile(getFormStyles(), 'gbf-bookmarker-styles.css', 'text/plain');
};

const getFormStyles = () => {
  return stylesEditor.getValue();
};

const importStyles = () => {
  var confirmed = confirm('Are you sure you want to override you styles?');
  if (confirmed) {
    document.getElementById('styles-file-input').click();
  }
};

const resetStyles = () => {
  var confirmed = confirm('Are you sure you want to reset you styles?');
  if (confirmed) {
    applyStyles('');
  }
};

const onStylesFileInputChange = ({ target }) => {
  const reader = new FileReader();
  reader.onload = ({ target }) => applyStyles(target.result);
  reader.readAsText(target.files[0]);
};

initializeStyles();
