export const calcSize = (size: number) => {
  if (size < 1024) {
    return size + 'B';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'K';
  } else if (size < 1024 * 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + 'M';
  } else {
    return (size / 1024 / 1024 / 1024).toFixed(2) + 'G';
  }
};
