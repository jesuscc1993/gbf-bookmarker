export const downloadFile = (content, fileName, type) => {
  const file = new Blob([content], { type });
  const href = URL.createObjectURL(file);
  jQuery(`<a href="${href}" download="${fileName}">`)[0].click();
};

export const fetchJson = (url) => {
  return fetch(url).then((response) => response.json());
};
