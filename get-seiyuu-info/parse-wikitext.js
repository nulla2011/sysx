"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWiki = void 0;
const utils_1 = require("./utils");
// export function getInfoFromText(text: string) {
//     let t = wtf(text).section('参见')?.links();
//     console.log(t);
// }
function sliceText(text, startReg, endMark = '}') {
    let mStart = text.match(startReg);
    if (!mStart) {
        (0, utils_1.logError)(`can\'t find ${startReg}`);
        return null;
    }
    let curlyBrackets = new utils_1.Stack();
    let end = mStart.index + 1;
    while (true) {
        switch (text[end]) {
            case '{':
                curlyBrackets.push();
                break;
            case '}':
                curlyBrackets.pop();
                break;
            default:
                break;
        }
        if (text[end] == endMark && curlyBrackets.isEmpty()) {
            break;
        }
        end++;
    }
    return text.slice(mStart.index + mStart[0].length, end - (endMark == '}' ? 1 : 0)); //double curly brackets
}
function removeHeimu(text) {
    return text.replace(/{{黑幕\|([^{}]*?)}}/g, '$1');
}
function removeRef(text) {
    return text.replace(/<ref>.*?<\/ref>/g, '');
}
function removeDel(text) {
    return text.replace(/<del>.*?<\/del>/g, '');
}
function removeInternalLink(text) {
    return text.replace(/\[\[([^\[\]]*?)\]\]/g, '$1');
}
function removeSource(text) {
    return text.replace(/{{来源请求\|([^{}]*?)}}/g, '');
}
function replaceLangJa(text) {
    return text.replace(/{{lang\|ja\|/g, '{{lj|');
}
function getSeiyuInfoTemplate(text) {
    return sliceText(text.replace(/\s/g, ''), /{{声优信息/);
}
function getName(templateText) {
    var _a;
    let nameString = sliceText(templateText, /\|姓名=/, '|');
    if (nameString == '' || nameString == null) {
        nameString = sliceText(templateText, /\|本名=/, '|');
    }
    if (nameString == null) {
        return null;
    }
    // console.log(nameString);
    // if (nameString == "|姓名=|") nameString = sliceText(templateText, '|本名=', '|')!;
    if (/{{黑幕/.test(nameString)) {
        console.error('有黑幕！！');
    }
    if (!/{/.test(nameString)) {
        return nameString.replace(/\|姓名=([^{}]*?)\|/, '$1');
    }
    let name = [];
    nameString = replaceLangJa(removeHeimu(nameString));
    let mJpn = (_a = nameString.match(/{{jpn\|([^{}]*?)}}/i)) !== null && _a !== void 0 ? _a : nameString.match(/{{日本人名\|([^{}]*?)}}/); //jpn=日本人名，这种模板应该只有一个吧？
    // let mLjRuby = nameString.match(
    //   /{{lj\|(([^{}])|{{ruby\|([^|]*)\|([^|]*)*?}})(([^{}])|{{ruby\|([^|]*)\|([^|]*)*?}})?(([^{}])|{{ruby\|([^|]*)\|([^|]*)*?}})?/i
    // ); //废案
    let mLjRuby = nameString.match(/{{lj\|{{ruby\|[^}]*?}}([^{}]*)}}/i); //只能匹配名为假名
    let mRuby = nameString.matchAll(/{{ruby\|([^{}]*?)}}/gi); //ruby的不止姓和名
    // let mLangJa = nameString.matchAll(/{{lang\|ja\|([^{}]*?)}}/gi);
    let mLj = nameString.matchAll(/{{lj\|([^{}]*?)}}/gi); //lang-ja = lj
    if (mJpn) {
        let splitBar = mJpn[1].split('|');
        name.push([splitBar[0], splitBar[1]]);
        name.push([splitBar[2], splitBar[3]]);
    }
    if (mRuby || mLj) {
        for (const ruby of mRuby) {
            let splitBar = ruby[1].split('|');
            name.push([splitBar[0], splitBar[1]]);
        }
        if (mLjRuby) {
            name.push([mLjRuby[1], null]);
        }
        // for (const lja of mLangJa) {
        //   //一般纯假名的都是名字吧 懒得排序了
        //   let splitBar = lja[1].split('|');
        //   name.push([splitBar[0], splitBar[1]]);
        // }
        for (const lj of mLj) {
            //一般纯假名的都是名字吧 懒得排序了
            let splitBar = lj[1].split('|');
            name.push([splitBar[0], splitBar[1]]);
        }
    }
    return name.map((l) => l.map((i) => {
        if (i == '' || i == '?' || i == undefined) {
            return null;
        }
        else
            return i;
    }));
}
function getBirth(templateText) {
    var _a;
    return removeSource(removeDel(removeRef(removeHeimu((_a = sliceText(templateText, /\|生日=/, '|')) !== null && _a !== void 0 ? _a : sliceText(templateText, /\|出生=/, '|')))));
}
function getJimusho(templateText) {
    let jimushoString = sliceText(templateText, /\|所属公司=/, '|');
    if (jimushoString == null) {
        return null;
    }
    jimushoString = removeDel(removeRef(removeHeimu(removeInternalLink(jimushoString))));
    let list = jimushoString.split(/、|<br>|<br\/>/);
    if (list.length == 1) {
        return jimushoString.replace(/(\(|（).*?事务所(\)|）)/, '');
    }
    else {
        for (const j of list) {
            if (j.match(/声优事务|事务所/)) {
                if (j.includes('：')) {
                    return j.split('：')[1];
                }
                else if (j.includes('（') || j.includes('(')) {
                    return j.substring(0, j.search(/\(|（/));
                }
            }
        }
    }
    return null;
}
function getLinks(text) {
    var _a, _b, _c, _d, _e;
    let linkIndex = text.search(/={1,5}.*?(外部链接|链接与(外部)?注释).*?={1,5}/);
    let links = {};
    if (linkIndex == -1) {
        console.error("can't find 外部链接");
        return null;
    }
    else {
        let linkText = text.substring(linkIndex);
        // console.log(linkText);
        links.profile = (_a = linkText.match(/\[(https?:\/\/[\S]*?) (事务所(官方资料|网站)|(事(务|務)所|官方)(个人|個人|官网)?(介绍|介紹|信息)(页|頁)?)[^\]]*?\]/i)) === null || _a === void 0 ? void 0 : _a[1];
        links.twitter = (_b = linkText.match(/\[(https?:\/\/[\S]*?) .*?(twitter|推特).*?\]/i)) === null || _b === void 0 ? void 0 : _b[1];
        if (!links.twitter) {
            links.twitter = (_c = linkText.match(/{{Twitter\|.*?id=([\w\d_]+)(\||})/i)) === null || _c === void 0 ? void 0 : _c[1]; //有可能用的是推特模板，比如中村绘里子的页面
            if (links.twitter) {
                links.twitter = 'https://twitter.com/' + links.twitter;
            }
        }
        links.instagram = (_d = linkText.match(/\[(https?:\/\/[\S]*?) .*?ins(tagram)?.*?\]/i)) === null || _d === void 0 ? void 0 : _d[1];
        links.blog = (_e = linkText.match(/\[(https?:\/\/[\S]*?) .*?(blog|博客).*?\]/i)) === null || _e === void 0 ? void 0 : _e[1];
    }
    return links;
}
function parseWiki(text) {
    let template = getSeiyuInfoTemplate(text);
    let name = getName(template);
    let birth = getBirth(template);
    let jimusho = getJimusho(template);
    let links = getLinks(text);
    return { name, birth, jimusho, links };
}
exports.parseWiki = parseWiki;
