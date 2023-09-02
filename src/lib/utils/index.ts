export * from './valid';
export * from './signMessage';
export * from './download';
export * from './file';

export function hideHalfString(str: string) {
  const len = str.length;
  const halfLen = Math.floor(len / 2);
  const stars = '*'.repeat(halfLen);
  const hiddenStr =
    str.substring(0, (len - halfLen) / 2) +
    stars +
    str.substring((len - halfLen) / 2 + halfLen);
  return hiddenStr;
}

export function delay(num: number) {
  return new Promise((resolve, rejcet) => {
    setTimeout(() => {
      resolve(true);
    }, num);
  });
}
