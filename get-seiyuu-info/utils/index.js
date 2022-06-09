"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = exports.isAllChinese = exports.randomTimeLong = exports.randomTimeShort = exports.logWarning = exports.log = exports.logError = void 0;
const chalk_1 = __importDefault(require("chalk"));
function hex2int(hex) {
    return parseInt(hex, 16);
}
function logError(text) {
    console.error(chalk_1.default.bgRed.white(text));
}
exports.logError = logError;
function log(text) {
    console.log(chalk_1.default.white(text));
}
exports.log = log;
function logWarning(text) {
    console.log(chalk_1.default.bgHex('#A0A000').white(text));
}
exports.logWarning = logWarning;
function randomTimeShort() {
    let timeout = (Math.random() * 5 + 5) * 1000;
    return new Promise((resolve) => {
        setTimeout(() => resolve(), timeout);
    });
}
exports.randomTimeShort = randomTimeShort;
function randomTimeLong() {
    let timeout = (Math.random() * 10 + 10) * 1000;
    return new Promise((resolve) => {
        setTimeout(() => resolve(), timeout);
    });
}
exports.randomTimeLong = randomTimeLong;
function isAllChinese(text) {
    for (let i = 0; i < text.length; i++) {
        let c = text.charCodeAt(i);
        if (c < hex2int('3400') ||
            (c > hex2int('4DBF') && c < hex2int('4E00')) ||
            c > hex2int('9FFF')) {
            return false;
        }
    }
    return true;
}
exports.isAllChinese = isAllChinese;
class Stack {
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
exports.Stack = Stack;