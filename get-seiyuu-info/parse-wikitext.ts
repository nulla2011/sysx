// import wtf from 'wtf_wikipedia';
import { logError, Stack } from './utils';

// export function getInfoFromText(text: string) {
//     let t = wtf(text).section('参见')?.links();
//     console.log(t);
// }
function sliceText(text: string, startReg: RegExp, endMark = '}') {
  let mStart = text.match(startReg)!;
  if (!mStart) {
    logError(`can\'t find ${startReg}`);
    return null;
  }
  let curlyBrackets = new Stack();
  let end = mStart.index! + 1;
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
  return text.slice(mStart.index! + mStart[0].length, end - (endMark == '}' ? 1 : 0)); //double curly brackets
}

String.prototype.removeHeimu = function () {
  return this.replace(/{{黑幕\|([^{}]*?)}}/g, '$1');
};
String.prototype.removeRef = function () {
  return this.replace(/<ref[^>]*?>.*?<\/ref>/g, '');
};
String.prototype.removeDel = function () {
  return this.replace(/<del>.*?<\/del>/g, '');
};
String.prototype.removeInternalLink = function () {
  return this.replace(/\[\[([^\[\]]*?)\]\]/g, '$1');
};
String.prototype.removeSource = function () {
  return this.replace(/{{来源请求\|([^{}]*?)}}/g, '');
};
String.prototype.replaceLangJa = function () {
  return this.replace(/{{lang\|ja\|/g, '{{lj|');
};

function getSeiyuInfoTemplate(text: string) {
  return sliceText(text, /{{声优信息/);
}
function getName(templateText: string) {
  let nameString = sliceText(templateText, /\|姓名=/, '|');
  if (nameString == '' || nameString == null) {
    nameString = sliceText(templateText, /\|本名=/, '|')!;
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
  nameString = nameString.removeHeimu().replaceLangJa();
  let mJpn =
    nameString.match(/{{jpn\|([^{}]*?)}}/i) ??
    nameString.match(/{{日本人名\|([^{}]*?)}}/); //jpn=日本人名，这种模板应该只有一个吧？
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
  return name.map((l) => {
    l = l.map((i) => (i == '' || i == '?' || i == undefined ? null : i));
    if (l[0] == l[1]) {
      l[1] = null;
    }
    return l;
  });
}
function getBirth(templateText: string) {
  return (
    sliceText(templateText, /\|生日=/, '|') ?? sliceText(templateText, /\|出生=/, '|')!
  )
    .removeHeimu()
    .removeRef()
    .removeDel()
    .removeSource();
}
function getJimusho(templateText: string) {
  let jimushoString = sliceText(templateText, /\|所属(公司|情况)\s*=/, '|')?.trim();
  if (jimushoString == null) {
    return null;
  }
  jimushoString = jimushoString
    .removeInternalLink()
    .removeHeimu()
    .removeRef()
    .removeDel();
  let list = jimushoString.split(/、|<br ?\/?>|\n/);
  if (list.length == 1) {
    return jimushoString.replace(/(\(|（).*?事务所(\)|）)/, '');
  } else {
    for (const j of list) {
      if (j.match(/声优事务|事务所|聲優事務所/)) {
        if (j.includes('：')) {
          return j.split('：')[1];
        } else if (j.includes('（') || j.includes('(')) {
          return j.substring(0, j.search(/\(|（/));
        }
      }
    }
  }
  return null;
}
interface Ilinks {
  profile?: string;
  twitter?: string;
  instagram?: string;
  blog?: string;
}
function getLinks(text: string) {
  let linkIndex = text.search(/={1,5}.*?(外部(链|鏈)接|链接与(外部)?注释).*?={1,5}/);
  let links: Ilinks = {};
  if (linkIndex == -1) {
    console.error("can't find 外部链接");
    return null;
  } else {
    let linkText = text.substring(linkIndex);
    // console.log(linkText);
    links.profile = linkText.match(
      /\[(https?:\/\/[\S]*?) (事务所(官方资料|网站)|(事(务|務)所|官方)(个人|個人|官网|官方)?(介绍|介紹|信息|简历)(页|頁)?)[^\]]*?\]/i
    )?.[1];
    links.twitter = linkText.match(/\[(https?:\/\/[\S]*?) .*?(twitter|推特).*?\]/i)?.[1];
    if (!links.twitter) {
      links.twitter = linkText.match(/{{Twitter\|.*?id=([\w\d_]+)(\||})/i)?.[1]; //有可能用的是推特模板，比如中村绘里子的页面
      if (!links.twitter) {
        links.twitter = linkText.match(/{{Twitter\|[\w]*\|([\w\d_]+)(\||})/i)?.[1];
      }
      if (links.twitter) {
        links.twitter = 'https://twitter.com/' + links.twitter;
      }
    }
    links.instagram = linkText.match(/\[(https?:\/\/[\S]*?) .*?ins(tagram)?.*?\]/i)?.[1];
    links.blog = linkText.match(/\[(https?:\/\/[\S]*?) .*?(blog|博客).*?\]/i)?.[1];
  }
  return links;
}
export function parseWiki(text: string) {
  let template = getSeiyuInfoTemplate(text)!;
  let name = getName(template.replace(/\s/g, ''));
  let birth = getBirth(template.replace(/\s/g, ''));
  let jimusho = getJimusho(template);
  jimusho = jimusho && jimusho.trim();
  let links = getLinks(text);
  return { name, birth, jimusho, links };
}
