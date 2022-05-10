"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pyszm = void 0;
const pinyin_1 = __importDefault(require("pinyin"));
const lodash_1 = __importDefault(require("lodash"));
function pyszm(text) {
    let xing = text.search('行');
    let hu = text.search('冴');
    let pysx = (0, pinyin_1.default)(text).reduce((p, c) => (p = p + lodash_1.default.deburr(c[0][0])), '');
    pysx = xing == -1 ? pysx : pysx.substring(0, xing) + 'x' + pysx.substring(xing + 1);
    pysx = hu == -1 ? pysx : pysx.substring(0, hu) + 'h' + pysx.substring(hu + 1);
    return pysx;
}
exports.pyszm = pyszm;
if (require.main === module) {
    console.log(pyszm(process.argv[2]));
}
