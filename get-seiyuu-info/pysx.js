"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pysx = void 0;
const pinyin_1 = __importDefault(require("pinyin"));
const lodash_1 = __importDefault(require("lodash"));
function pysx(text) {
    return (0, pinyin_1.default)(text).reduce((p, c) => p = p + lodash_1.default.deburr(c[0][0]), '');
}
exports.pysx = pysx;
console.log(pysx(process.argv[2]));
