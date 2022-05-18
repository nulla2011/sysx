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
const axios_1 = __importDefault(require("axios"));
const user_agents_1 = __importDefault(require("user-agents"));
const parse_wikitext_1 = require("./parse-wikitext");
const utils_1 = require("./utils");
const pyszm_1 = require("./pyszm");
const formatJimusho_1 = require("./utils/formatJimusho");
const MOEGIRL_API = new URL('https://zh.moegirl.org.cn/api.php');
const SEIYUU_LIST = 'seiyuu-list_constrict1.csv';
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
        this.jaName = null;
        this.birth = null;
        this.jimusho = null;
        this.profile = null;
        this.twitter = null;
        this.instagram = null;
        this.blog = null;
        this.pysx = null;
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
}
const getWikiData = (data) => {
    let pages = data.query.pages;
    return pages[Object.keys(pages)[0]].revisions[0]['*'];
};
const main = (arg) => __awaiter(void 0, void 0, void 0, function* () {
    let csvl = fs.readFileSync(__dirname + '/' + SEIYUU_LIST, 'utf-8').split('\n');
    let start = arg ? parseInt(arg) - 1 : Math.floor(Math.random() * 694);
    console.log(start);
    for (let i = start; i < start + 4; i++) {
        let [name, wikiName] = csvl[i].split(',');
        wikiName = decodeURI(wikiName.trim().replace('https://zh.moegirl.org.cn/', '')); //有些有歧义的会备注括号声优
        let seiyuu = new Seiyuu(name, wikiName);
        yield seiyuu.getDataFromWiki();
        seiyuu.setPysx();
        for (const key in seiyuu) {
            if (Object.prototype.hasOwnProperty.call(seiyuu, key)) {
                if (!seiyuu[key]) {
                    if (key == 'blog' || key == 'twitter' || key == 'instagram') {
                        (0, utils_1.logWarning)(`${seiyuu.zhName} : ${key} is NULL!!!`);
                    }
                    else if (key == 'check') {
                    }
                    else {
                        (0, utils_1.logError)(`${seiyuu.zhName} : ${key} is NULL!!!`);
                        seiyuu.check = true;
                    }
                }
            }
        }
        if (seiyuu.jaName instanceof Array) {
            if (seiyuu.jaName.length == 1) {
                seiyuu.check = true;
            }
            else if (!seiyuu.jaName[1][0]) {
                seiyuu.check = true;
            }
        }
        console.log(seiyuu.jaName);
        console.log(seiyuu.pysx);
        console.log(seiyuu.jimusho);
        yield (0, utils_1.randomTimeShort)();
    }
});
main(process.argv[2]);
