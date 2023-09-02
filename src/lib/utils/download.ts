export const download = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  document.body.appendChild(link);
  setTimeout(() => {
    link.remove();
  }, 200);
};
