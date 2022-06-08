"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const yaml_1 = __importDefault(require("yaml"));
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const searchUrl = 'https://seigura.com/?post_type=directory&s=';
const SEIYUU_INFO_PATH = path_1.default.resolve(__dirname, '../', 'seiyuu-info.yaml');
const SEIYUU_NEW_INFO_PATH = path_1.default.resolve(__dirname, '../', 'seiyuu-info_new.yaml');
const getPhoto = (name) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    try {
        response = yield axios_1.default.get(searchUrl + encodeURI(name));
    }
    catch (error) {
        console.error(error);
        process.exit(0);
    }
    let $ = cheerio_1.default.load(response.data);
    let result = $('.archive-list-wrap').children();
    if (result.length === 0) {
        (0, utils_1.logError)(`Can't find ${name}`);
        return null;
    }
    else {
        if (result.length > 1) {
            (0, utils_1.logWarning)('not only one result');
        }
        for (const el of result) {
            if ($('.entry-title a', el).text().replace(/\s/g, '') == name) {
                return $('.archive-thumbnail > a > img', el).attr('src');
            }
        }
        (0, utils_1.logError)(`${name} not match!`);
        return null;
    }
});
const test = (name) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(yield getPhoto(name));
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let info = yaml_1.default.parse(fs.readFileSync(SEIYUU_INFO_PATH, 'utf-8'));
    fs.open(SEIYUU_NEW_INFO_PATH, 'a+', (error, fd) => __awaiter(void 0, void 0, void 0, function* () {
        let scrapedPhoto = yaml_1.default.parse(fs.readFileSync(fd, 'utf-8'));
        for (const key in info) {
            if (scrapedPhoto[key]) {
                continue;
            }
            let name = info[key].jaName;
            name =
                typeof name == 'string'
                    ? name
                    : name.reduce((p, c) => (p = p + c[0]), '');
            yield getPhoto(name)
                .then((v) => (info[key].photo = v))
                .catch((e) => {
                (0, utils_1.logError)(e);
                fs.close(fd);
                process.exit(0);
            });
            try {
                fs.appendFileSync(fd, yaml_1.default.stringify({ [key]: info[key] }), 'utf-8');
                (0, utils_1.log)(`${name} write success!`);
            }
            catch (error) {
                (0, utils_1.logError)(error);
                fs.close(fd);
            }
            yield (0, utils_1.randomTimeShort)();
        }
        fs.close(fd);
    }));
});
if (require.main === module) {
    if (process.argv[2]) {
        test(process.argv[2]);
    }
    else {
        main();
    }
}
