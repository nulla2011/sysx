import pinyin from 'pinyin';
import _ from 'lodash';

export function pyszm(text: string) {
  let xing = text.search('行');
  let pysx = pinyin(text).reduce((p, c) => (p = p + _.deburr(c[0][0])), '');
  return xing == -1 ? pysx : pysx.substring(0, xing) + 'x' + pysx.substring(xing + 1);
}

console.log(pyszm(process.argv[2]));
