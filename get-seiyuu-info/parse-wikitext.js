"use strict";
// import wtf from 'wtf_wikipedia';
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWiki = void 0;
// export function getInfoFromText(text: string) {
//     let t = wtf(text).section('参见')?.links();
//     console.log(t);
// }
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
function sliceText(text, startReg, endMark = '}') {
    let mStart = text.match(startReg);
    if (!mStart) {
        console.error(`can\'t find ${startReg}`);
        return null;
    }
    let curlyBrackets = new Stack();
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
function getSeiyuInfoTemplate(text) {
    return sliceText(text.replace(/\s/g, ''), /{{声优信息/);
}
function getName(templateText) {
    var _a;
    let nameString = sliceText(templateText, /\|姓名=/, '|');
    if (nameString == '' || nameString == null) {
        nameString = sliceText(templateText, /\|本名=/, '|');
    }
    // console.log(nameString);
    // if (nameString == "|姓名=|") nameString = sliceText(templateText, '|本名=', '|')!;
    if (/{{黑幕/.test(nameString)) {
        console.error("有黑木！！");
    }
    if (!(/{/.test(nameString))) {
        return nameString.replace(/\|姓名=([^{}]*?)\|/, '$1');
    }
    let name = [];
    //todo: remove lj
    let mJpn = (_a = nameString.match(/{{jpn\|([^{}]*?)}}/i)) !== null && _a !== void 0 ? _a : nameString.match(/{{日本人名\|([^{}]*?)}}/); //jpn=日本人名，这种模板应该只有一个吧？
    let mRuby = nameString.matchAll(/{{ruby\|([^{}]*?)}}/ig); //ruby的不止姓和名
    let mLangJa = nameString.matchAll(/{{lang\|ja\|([^{}]*?)}}/ig);
    let mLj = nameString.matchAll(/{{lj\|([^{}]*?)}}/ig); //lang-ja = lj
    if (mJpn) {
        let splitBar = mJpn[1].split('|');
        name.push([splitBar[0], splitBar[1]]);
        name.push([splitBar[2], splitBar[3]]);
    }
    if (mRuby || mLangJa || mLj) {
        for (const ruby of mRuby) {
            let splitBar = ruby[1].split('|');
            name.push([splitBar[0], splitBar[1]]);
        }
        for (const lja of mLangJa) { //一般纯假名的都是名字吧 懒得排序了
            let splitBar = lja[1].split('|');
            name.push([splitBar[0], splitBar[1]]);
        }
        for (const lj of mLj) { //一般纯假名的都是名字吧 懒得排序了
            let splitBar = lj[1].split('|');
            name.push([splitBar[0], splitBar[1]]);
        }
    }
    //替换空内容替换问号
    return name;
}
function getBirth(templateText) {
    var _a;
    return removeSource(removeDel(removeRef(removeHeimu((_a = sliceText(templateText, /\|生日=/, '|')) !== null && _a !== void 0 ? _a : sliceText(templateText, /\|出生=/, '|')))));
}
function getJimusho(templateText) {
    let jimushoString = sliceText(templateText, /\|所属公司=/, '|');
    if (jimushoString == null) {
        return '';
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
    return '';
}
function getLinks(text) {
    var _a, _b, _c;
    let linkIndex = text.search(/={1,5}.*?外部链接.*?={1,5}/);
    let links = {};
    if (linkIndex == -1) {
        console.error("can't find 外部链接");
        return null;
    }
    else {
        let linkText = text.substring(linkIndex);
        console.log(linkText);
        links.profile = (_a = linkText.match(/\[(https?:\/\/[\S]*?) (事务所(官方资料|网站)|(事(务|務)所|官方)(个人|個人|官网)?(介绍|介紹|信息)(页|頁)?)[^\]]*?\]/i)) === null || _a === void 0 ? void 0 : _a[1];
        links.twitter = (_b = linkText.match(/\[(https?:\/\/[\S]*?) .*?(twitter|推特)\]/i)) === null || _b === void 0 ? void 0 : _b[1];
        links.instagram = (_c = linkText.match(/\[(https?:\/\/[\S]*?) .*?ins\]/i)) === null || _c === void 0 ? void 0 : _c[1];
    }
    return links;
}
function parseWiki(text) {
    let template = getSeiyuInfoTemplate(text);
    let name = getName(template);
    let birth = getBirth(template);
    let jimusho = getJimusho(template);
    let links = getLinks(text);
    return [name, birth, jimusho, links];
}
exports.parseWiki = parseWiki;
