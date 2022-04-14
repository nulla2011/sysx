import pinyin from 'pinyin';
import _ from 'lodash';

export function pysx(text: string) {
    return pinyin(text).reduce((p, c) => p = p + _.deburr(c[0][0]), '');
}

console.log(pysx(process.argv[2]));