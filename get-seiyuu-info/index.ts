import * as fs from 'fs';
import axios, { AxiosResponse } from 'axios';
import UserAgent from 'user-agents';
import { parseWiki } from './parse-wikitext';
import YAML from 'yaml';
import { isAllChinese, logError, logWarning, randomTimeShort } from './utils';
import { pyszm } from './pyszm';
import { formatJimusho } from './utils/formatJimusho';

const MOEGIRL_API = new URL('https://zh.moegirl.org.cn/api.php');
const SEIYUU_LIST = 'seiyuu-list_constrict1.csv';
interface Iparams {
  [key: string]: string;
}
const params: Iparams = {
  action: 'query',
  format: 'json',
  prop: 'revisions',
  rvprop: 'content',
};
for (const key in params) {
  MOEGIRL_API.searchParams.set(key, params[key]);
}

class Seiyuu {
  public jaName: string | null | (string | null)[][] = null;
  public birth: string | null = null;
  public jimusho: string | null = null;
  public profile: string | null = null;
  public twitter: string | null = null;
  public instagram: string | null = null;
  public blog: string | null = null;
  public pysx: string | null = null;
  public check;
  constructor(public zhName: string, private wikiName: string) {
    this.check = false;
  }
  public async getDataFromWiki() {
    MOEGIRL_API.searchParams.set('titles', this.wikiName);
    let response: AxiosResponse;
    try {
      response = await axios.get(MOEGIRL_API.href, {
        headers: {
          'user-agent': new UserAgent().toString(),
        },
      });
    } catch (error) {
      console.error(error);
      process.exit(0);
    }
    if (response.headers['content-type'].includes('text/html')) {
      if (response.data.includes('Captcha')) {
        logError('可能需要去拖一下验证码');
      } else {
        logError(`你被拉黑了！`);
      }
      logError(`停在了 ${this.zhName}`);
      process.exit(0);
    }
    let wikiText = getWikiData(response.data);
    try {
      let c = parseWiki(wikiText);
      this.jaName = c.name;
      this.birth = c.birth;
      this.jimusho = formatJimusho(c.jimusho);
      this.twitter = c.links!.twitter ?? null;
      this.instagram = c.links!.instagram ?? null;
      this.blog = c.links!.blog ?? null;
      this.profile = c.links!.profile ?? null;
    } catch (error) {
      logError(`${this.wikiName} ${error}`);
    }
  }
  public setPysx() {
    this.pysx = isAllChinese(this.zhName) ? pyszm(this.zhName) : null;
  }
}
const getWikiData = (data: any): string => {
  let pages = data.query.pages;
  return pages[Object.keys(pages)[0]].revisions[0]['*'];
};
const main = async (arg: string) => {
  let csvl = fs.readFileSync(__dirname + '/' + SEIYUU_LIST, 'utf-8').split('\n');
  let start = arg ? parseInt(arg) - 1 : Math.floor(Math.random() * 694);
  console.log(start);
  for (let i = start; i < start + 4; i++) {
    let [name, wikiName] = csvl[i].split(',');
    wikiName = decodeURI(wikiName.trim().replace('https://zh.moegirl.org.cn/', '')); //有些有歧义的会备注括号声优
    let seiyuu = new Seiyuu(name, wikiName);
    await seiyuu.getDataFromWiki();
    seiyuu.setPysx();
    for (const key in seiyuu) {
      if (Object.prototype.hasOwnProperty.call(seiyuu, key)) {
        if (!seiyuu[key]) {
          if (key == 'blog' || key == 'twitter' || key == 'instagram') {
            logWarning(`${seiyuu.zhName} : ${key} is NULL!!!`);
          } else if (key == 'check') {
          } else {
            logError(`${seiyuu.zhName} : ${key} is NULL!!!`);
            seiyuu.check = true;
          }
        }
      }
    }
    if (seiyuu.jaName instanceof Array) {
      if (seiyuu.jaName.length == 1) {
        seiyuu.check = true;
      } else if (!seiyuu.jaName[1][0]) {
        seiyuu.check = true;
      }
    }
    console.log(seiyuu.jaName);
    console.log(seiyuu.pysx);
    console.log(seiyuu.jimusho);
    await randomTimeShort();
  }
};

main(process.argv[2]);
