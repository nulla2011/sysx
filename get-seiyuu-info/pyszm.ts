import pinyin from 'pinyin';
import _ from 'lodash';

function replaceChar(string: string, char: string, position: number) {
  return string.substring(0, position) + char + string.substring(position + 1);
}
export function pyszm(text: string) {
  let xing = text.search('行');
  let hu = text.search('冴');
  let jian = text.search('㭴');
  let pysx = pinyin(text).reduce((p, c) => (p = p + _.deburr(c[0][0])), '');
  pysx = xing == -1 ? pysx : replaceChar(pysx, 'x', xing);
  pysx = hu == -1 ? pysx : replaceChar(pysx, 'h', hu);
  pysx = jian == -1 ? pysx : replaceChar(pysx, 'j', jian);
  return pysx;
}

if (require.main === module) {
  console.log(pyszm(process.argv[2]));
}
