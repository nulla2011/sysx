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
const MOEGIRL_API = new URL('https://zh.moegirl.org.cn/api.php');
const SEIYUU_LIST = "seiyuu-list_constrict1.csv";
const params = {
    action: 'query',
    format: 'json',
    prop: 'revisions',
    rvprop: 'content',
};
for (const key in params) {
    MOEGIRL_API.searchParams.set(key, params[key]);
}
class seiyuu {
    constructor(name, origName) { }
}
const getWikiData = (data) => {
    let pages = data.query.pages;
    return pages[Object.keys(pages)[0]].revisions[0]["*"];
};
const main = (arg) => __awaiter(void 0, void 0, void 0, function* () {
    let l = fs.readFileSync(__dirname + '/' + SEIYUU_LIST, 'utf-8').split('\n');
    let start = arg ? parseInt(arg) - 1 : Math.floor(Math.random() * 694);
    for (let i = start; i < start + 4; i++) {
        let name = decodeURI(l[i].split(',')[1].trim().replace('https://zh.moegirl.org.cn/', '')); //有些有歧义的会备注声优
        MOEGIRL_API.searchParams.set('titles', name);
        let response;
        try {
            response = yield axios_1.default.get(MOEGIRL_API.href, {
                headers: {
                    'user-agent': new user_agents_1.default().toString()
                }
            });
        }
        catch (error) {
            console.error(`${error}`);
            process.exit(0);
        }
        if (response.headers['content-type'].includes('text/html')) {
            console.log(`你被拉黑了！停在了 ${response.config.url}`);
            process.exit(0);
        }
        let wikiText = getWikiData(response.data);
        try {
            console.log((0, parse_wikitext_1.parseWiki)(wikiText));
        }
        catch (error) {
            console.error(`${name} ${error}`);
        }
    }
    ;
});
main(process.argv[2]);
