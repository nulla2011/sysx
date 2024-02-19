import * as fs from 'fs';
import path from 'path';
import axios, { AxiosResponse } from 'axios';
import UserAgent from 'user-agents';
import YAML from 'yaml';
import _ from 'lodash';
import { parseWiki } from './parse-wikitext';
import { isAllChinese, logError, logWarning, log, randomTimeLong } from './utils';
import { formatJimusho } from './utils/formatJimusho';
import { pyszm } from './pyszm';
import { readFileSync } from 'fs';

const MOEGIRL_API = new URL('https://zh.moegirl.org.cn/api.php');
const SEIYUU_LIST = 'seiyuu-list_constrict1.csv';
const SEIYUU_INFO = 'seiyuu-info.yaml';
const SEIYUU_INFO_PATH = path.resolve(__dirname, '../', SEIYUU_INFO);
const COOKIE = readFileSync('cookie.secr', 'utf-8');

const params: { [key: string]: string } = {
  action: 'query',
  format: 'json',
  prop: 'revisions',
  rvprop: 'content',
};
for (const key in params) {
  MOEGIRL_API.searchParams.set(key, params[key]);
}

class Seiyuu {
  public pysx: string | null = null;
  public jaName: string | null | (string | null)[][] = null;
  public birth: string | null = null;
  public jimusho: string | null = null;
  public profile: string | null = null;
  public twitter: string | null = null;
  public instagram: string | null = null;
  public blog: string | null = null;
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
          cookie: COOKIE,
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
  public warnValue() {
    for (const key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        if (!this[key]) {
          if (key == 'blog' || key == 'twitter' || key == 'instagram') {
            logWarning(`${this.zhName} : ${key} is NULL!!!`);
          } else if (key == 'check') {
          } else {
            logError(`${this.zhName} : ${key} is NULL!!!`);
            this.check = true;
          }
        }
      }
    }
    if (this.jaName instanceof Array) {
      if (this.jaName.length == 1) {
        this.check = true;
      } else if (!this.jaName[1][0]) {
        this.check = true;
      }
    }
  }
}
const getWikiData = (data: any): string => {
  let pages: any;
  try {
    pages = data.query.pages;
  } catch (error) {
    console.log(data);
    process.exit();
  }
  return pages[Object.keys(pages)[0]].revisions[0]['*'];
};
const appendInfo = async () => {
  for (let i = 0; i < csvl.length; i++) {
    let [name, wikiName] = csvl[i].split(',');
    name = name.trim().replace(/\u200E/g, ''); //有些名字后面有神秘的从左向右控制符，比如大野柚布子
    if (info[name]) continue;
    wikiName = decodeURI(wikiName.trim().replace('https://zh.moegirl.org.cn/', '')); //有些有歧义的会备注括号声优
    let seiyuu = new Seiyuu(name, wikiName);
    await seiyuu.getDataFromWiki();
    seiyuu.setPysx();
    seiyuu.warnValue();
    console.log(seiyuu.jaName);
    console.log(seiyuu.pysx);
    console.log(seiyuu.jimusho);
    fs.appendFileSync(
      SEIYUU_INFO_PATH,
      YAML.stringify({
        [seiyuu.zhName]: _.omit(seiyuu, ['zhName', 'wikiName']),
      }),
      'utf-8'
    );
    await randomTimeLong();
  }
};
const updateInfo = async (name: string) => {
  let seiyuu = await queryInfo(name);
  if (seiyuu) {
    if (info[seiyuu.zhName]) {
      info[seiyuu.zhName] = _.omit(seiyuu, ['zhName', 'wikiName']);
      fs.writeFileSync(SEIYUU_INFO_PATH, YAML.stringify(info));
      log('write success!');
    } else {
      logError('not found!');
    }
  }
};
const queryInfo = async (name: string) => {
  for (const l of csvl) {
    if (l.startsWith(name)) {
      let wikiName = l.split(',')[1];
      wikiName = decodeURI(wikiName.trim().replace('https://zh.moegirl.org.cn/', '')); //有些有歧义的会备注括号声优
      let seiyuu = new Seiyuu(name, wikiName);
      await seiyuu.getDataFromWiki();
      seiyuu.setPysx();
      seiyuu.warnValue();
      console.log(seiyuu.jaName);
      console.log(seiyuu.pysx);
      console.log(seiyuu.jimusho);
      return seiyuu;
    }
  }
  return null;
};
const main = async (arg1: string, arg2: string) => {
  if (!arg1) {
    appendInfo();
  }
  if (arg1 == 'test') {
    queryInfo(arg2);
  }
  if (arg1 == 'update') {
    updateInfo(arg2);
  }
};

let csvl = fs.readFileSync(path.resolve(__dirname, SEIYUU_LIST), 'utf-8').split('\n');
let finfo: any;
try {
  finfo = fs.readFileSync(SEIYUU_INFO_PATH, 'utf-8');
} catch (error) {
  logError(`${SEIYUU_INFO} not exists!`);
  try {
    fs.copyFileSync(SEIYUU_INFO_PATH, SEIYUU_INFO_PATH + '.bak');
  } catch (error) {
  } finally {
    fs.writeFileSync(SEIYUU_INFO_PATH, '');
    process.exit();
  }
}
let info: { [key: string]: Partial<Seiyuu> };
if (finfo == '') {
  info = {};
} else {
  info = YAML.parse(finfo);
}
main(process.argv[2], process.argv[3]);
