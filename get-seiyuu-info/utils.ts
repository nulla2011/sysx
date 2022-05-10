import chalk from 'chalk';

export function logError(text: string) {
  console.log(chalk.bgRed.white(text));
}
export function log(text: string) {
  console.log(chalk.white(text));
}
export function logWarning(text: string) {
  console.log(chalk.bgYellow.white(text));
}
export function randomTimeShort() {
  let timeout = (Math.random() * 5 + 5) * 1000;
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), timeout);
  });
}
export function isAllChinese(text: string) {
  for (let i = 0; i < text.length; i++) {
    let c = text.charCodeAt(i);
    if (c < parseInt('4E00', 16) || c > parseInt('9FFF', 16)) {
      return false;
    }
  }
  return true;
}
