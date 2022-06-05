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
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const user_agents_1 = __importDefault(require("user-agents"));
const yaml_1 = __importDefault(require("yaml"));
const lodash_1 = __importDefault(require("lodash"));
const parse_wikitext_1 = require("./parse-wikitext");
const utils_1 = require("./utils");
const formatJimusho_1 = require("./utils/formatJimusho");
const pyszm_1 = require("./pyszm");
const MOEGIRL_API = new URL('https://zh.moegirl.org.cn/api.php');
const SEIYUU_LIST = 'seiyuu-list_constrict1.csv';
const SEIYUU_INFO = 'seiyuu-info.yaml';
const SEIYUU_INFO_PATH = path_1.default.resolve(__dirname, '../', SEIYUU_INFO);
const params = {
    action: 'query',
    format: 'json',
    prop: 'revisions',
    rvprop: 'content',
};
for (const key in params) {
    MOEGIRL_API.searchParams.set(key, params[key]);
}
class Seiyuu {
    constructor(zhName, wikiName) {
        this.zhName = zhName;
        this.wikiName = wikiName;
        this.pysx = null;
        this.jaName = null;
        this.birth = null;
        this.jimusho = null;
        this.profile = null;
        this.twitter = null;
        this.instagram = null;
        this.blog = null;
        this.check = false;
    }
    getDataFromWiki() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            MOEGIRL_API.searchParams.set('titles', this.wikiName);
            let response;
            try {
                response = yield axios_1.default.get(MOEGIRL_API.href, {
                    headers: {
                        'user-agent': new user_agents_1.default().toString(),
                    },
                });
            }
            catch (error) {
                console.error(error);
                process.exit(0);
            }
            if (response.headers['content-type'].includes('text/html')) {
                if (response.data.includes('Captcha')) {
                    (0, utils_1.logError)('可能需要去拖一下验证码');
                }
                else {
                    (0, utils_1.logError)(`你被拉黑了！`);
                }
                (0, utils_1.logError)(`停在了 ${this.zhName}`);
                process.exit(0);
            }
            let wikiText = getWikiData(response.data);
            try {
                let c = (0, parse_wikitext_1.parseWiki)(wikiText);
                this.jaName = c.name;
                this.birth = c.birth;
                this.jimusho = (0, formatJimusho_1.formatJimusho)(c.jimusho);
                this.twitter = (_a = c.links.twitter) !== null && _a !== void 0 ? _a : null;
                this.instagram = (_b = c.links.instagram) !== null && _b !== void 0 ? _b : null;
                this.blog = (_c = c.links.blog) !== null && _c !== void 0 ? _c : null;
                this.profile = (_d = c.links.profile) !== null && _d !== void 0 ? _d : null;
            }
            catch (error) {
                (0, utils_1.logError)(`${this.wikiName} ${error}`);
            }
        });
    }
    setPysx() {
        this.pysx = (0, utils_1.isAllChinese)(this.zhName) ? (0, pyszm_1.pyszm)(this.zhName) : null;
    }
    warnValue() {
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                if (!this[key]) {
                    if (key == 'blog' || key == 'twitter' || key == 'instagram') {
                        (0, utils_1.logWarning)(`${this.zhName} : ${key} is NULL!!!`);
                    }
                    else if (key == 'check') {
                    }
                    else {
                        (0, utils_1.logError)(`${this.zhName} : ${key} is NULL!!!`);
                        this.check = true;
                    }
                }
            }
        }
        if (this.jaName instanceof Array) {
            if (this.jaName.length == 1) {
                this.check = true;
            }
            else if (!this.jaName[1][0]) {
                this.check = true;
            }
        }
    }
}
const getWikiData = (data) => {
    let pages;
    try {
        pages = data.query.pages;
    }
    catch (error) {
        console.log(data);
        process.exit();
    }
    return pages[Object.keys(pages)[0]].revisions[0]['*'];
};
const appendInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < csvl.length; i++) {
        let [name, wikiName] = csvl[i].split(',');
        name = name.trim().replace(/\u200E/g, ''); //有些名字后面有神秘的从左向右控制符，比如大野柚布子
        if (info[name])
            continue;
        wikiName = decodeURI(wikiName.trim().replace('https://zh.moegirl.org.cn/', '')); //有些有歧义的会备注括号声优
        let seiyuu = new Seiyuu(name, wikiName);
        yield seiyuu.getDataFromWiki();
        seiyuu.setPysx();
        seiyuu.warnValue();
        console.log(seiyuu.jaName);
        console.log(seiyuu.pysx);
        console.log(seiyuu.jimusho);
        fs.appendFileSync(SEIYUU_INFO_PATH, yaml_1.default.stringify({
            [seiyuu.zhName]: lodash_1.default.omit(seiyuu, ['zhName', 'wikiName']),
        }), 'utf-8');
        yield (0, utils_1.randomTimeLong)();
    }
});
const updateInfo = (name) => __awaiter(void 0, void 0, void 0, function* () {
    let seiyuu = yield queryInfo(name);
    if (seiyuu) {
        if (info[seiyuu.zhName]) {
            info[seiyuu.zhName] = lodash_1.default.omit(seiyuu, ['zhName', 'wikiName']);
            fs.writeFileSync(SEIYUU_INFO_PATH, yaml_1.default.stringify(info));
            (0, utils_1.log)('write success!');
        }
        else {
            (0, utils_1.logError)('not found!');
        }
    }
});
const queryInfo = (name) => __awaiter(void 0, void 0, void 0, function* () {
    for (const l of csvl) {
        if (l.startsWith(name)) {
            let wikiName = l.split(',')[1];
            wikiName = decodeURI(wikiName.trim().replace('https://zh.moegirl.org.cn/', '')); //有些有歧义的会备注括号声优
            let seiyuu = new Seiyuu(name, wikiName);
            yield seiyuu.getDataFromWiki();
            seiyuu.setPysx();
            seiyuu.warnValue();
            console.log(seiyuu.jaName);
            console.log(seiyuu.pysx);
            console.log(seiyuu.jimusho);
            return seiyuu;
        }
    }
    return null;
});
const main = (arg1, arg2) => __awaiter(void 0, void 0, void 0, function* () {
    if (!arg1) {
        appendInfo();
    }
    if (arg1 == 'test') {
        queryInfo(arg2);
    }
    if (arg1 == 'update') {
        updateInfo(arg2);
    }
});
let csvl = fs.readFileSync(path_1.default.resolve(__dirname, SEIYUU_LIST), 'utf-8').split('\n');
let finfo;
try {
    finfo = fs.readFileSync(SEIYUU_INFO_PATH, 'utf-8');
}
catch (error) {
    (0, utils_1.logError)(`${SEIYUU_INFO} not exists!`);
    try {
        fs.copyFileSync(SEIYUU_INFO_PATH, SEIYUU_INFO_PATH + '.bak');
    }
    catch (error) {
    }
    finally {
        fs.writeFileSync(SEIYUU_INFO_PATH, '');
        process.exit();
    }
}
let info;
if (finfo == '') {
    info = {};
}
else {
    info = yaml_1.default.parse(finfo);
}
main(process.argv[2], process.argv[3]);
