const { storage, tabs } = chrome;

const reloadPreview = () => {
  jQuery('#preview')
    .get(0)
    .contentWindow.location.reload();
};
