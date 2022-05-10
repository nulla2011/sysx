"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllChinese = exports.randomTimeShort = exports.logWarning = exports.log = exports.logError = void 0;
const chalk_1 = __importDefault(require("chalk"));
function logError(text) {
    console.log(chalk_1.default.bgRed.white(text));
}
exports.logError = logError;
function log(text) {
    console.log(chalk_1.default.white(text));
}
exports.log = log;
function logWarning(text) {
    console.log(chalk_1.default.bgYellow.white(text));
}
exports.logWarning = logWarning;
function randomTimeShort() {
    let timeout = (Math.random() * 5 + 5) * 1000;
    return new Promise((resolve) => {
        setTimeout(() => resolve(), timeout);
    });
}
exports.randomTimeShort = randomTimeShort;
function isAllChinese(text) {
    for (let i = 0; i < text.length; i++) {
        let c = text.charCodeAt(i);
        if (c < parseInt('4E00', 16) || c > parseInt('9FFF', 16)) {
            return false;
        }
    }
    return true;
}
exports.isAllChinese = isAllChinese;
