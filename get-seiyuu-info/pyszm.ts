import pinyin from 'pinyin';
import _ from 'lodash';

export function pyszm(text: string) {
  let xing = text.search('行');
  let hu = text.search('冴');
  let pysx = pinyin(text).reduce((p, c) => (p = p + _.deburr(c[0][0])), '');
  pysx = xing == -1 ? pysx : pysx.substring(0, xing) + 'x' + pysx.substring(xing + 1);
  pysx = hu == -1 ? pysx : pysx.substring(0, hu) + 'h' + pysx.substring(hu + 1);
  return pysx;
}

if (require.main === module) {
  console.log(pyszm(process.argv[2]));
}
