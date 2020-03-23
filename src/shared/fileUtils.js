export const downloadFile = (content, fileName, type) => {
  const file = new Blob([content], { type });
  const href = URL.createObjectURL(file);
  jQuery(`<a href="${href}" download="${fileName}">`)[0].click();
};
