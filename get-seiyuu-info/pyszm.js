"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pyszm = void 0;
const pinyin_1 = __importDefault(require("pinyin"));
const lodash_1 = __importDefault(require("lodash"));
function replaceChar(string, char, position) {
    return string.substring(0, position) + char + string.substring(position + 1);
}
function pyszm(text) {
    let xing = text.search('行');
    let hu = text.search('冴');
    let jian = text.search('㭴');
    let pysx = (0, pinyin_1.default)(text).reduce((p, c) => (p = p + lodash_1.default.deburr(c[0][0])), '');
    pysx = xing == -1 ? pysx : replaceChar(pysx, 'x', xing);
    pysx = hu == -1 ? pysx : replaceChar(pysx, 'h', hu);
    pysx = jian == -1 ? pysx : replaceChar(pysx, 'j', jian);
    return pysx;
}
exports.pyszm = pyszm;
if (require.main === module) {
    console.log(pyszm(process.argv[2]));
}
