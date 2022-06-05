import chalk from 'chalk';

function hex2int(hex: string) {
  return parseInt(hex, 16);
}
export function logError(text: string) {
  console.error(chalk.bgRed.white(text));
}
export function log(text: string) {
  console.log(chalk.white(text));
}
export function logWarning(text: string) {
  console.log(chalk.bgHex('#A0A000').white(text));
}
export function randomTimeShort() {
  let timeout = (Math.random() * 5 + 5) * 1000;
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), timeout);
  });
}
export function randomTimeLong() {
  let timeout = (Math.random() * 10 + 10) * 1000;
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), timeout);
  });
}
export function isAllChinese(text: string) {
  for (let i = 0; i < text.length; i++) {
    let c = text.charCodeAt(i);
    if (
      c < hex2int('3400') ||
      (c > hex2int('4DBF') && c < hex2int('4E00')) ||
      c > hex2int('9FFF')
    ) {
      return false;
    }
  }
  return true;
}

export class Stack {
  private items: number;
  constructor() {
    this.items = 0;
  }
  push() {
    this.items++;
  }
  pop() {
    this.items--;
  }
  isEmpty() {
    return this.items == 0;
  }
}
