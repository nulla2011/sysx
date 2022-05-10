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
