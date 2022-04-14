import pinyin from 'pinyin';
import _ from 'lodash';

export function pyszm(text: string) {
    return pinyin(text).reduce((p, c) => p = p + _.deburr(c[0][0]), '');
}

console.log(pyszm(process.argv[2]));