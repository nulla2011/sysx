import * as cheerio from 'cheerio';
import YAML from 'yaml';
import axios, { AxiosResponse } from 'axios';
import { log, logError, logWarning, randomTimeShort } from './utils';
import path from 'path';
import * as fs from 'fs';

const searchUrl = 'https://seigura.com/?post_type=directory&s=';
const SEIYUU_INFO_PATH = path.resolve(__dirname, '../', 'seiyuu-info.yaml.bak');
const SEIYUU_NEW_INFO_PATH = path.resolve(__dirname, '../', 'seiyuu-info.yaml');

const getPhoto = async (name: string) => {
  let response: AxiosResponse;
  try {
    response = await axios.get(searchUrl + encodeURI(name));
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
  let $ = cheerio.load(response.data);
  let result = $('.archive-list-wrap').children();
  if (result.length === 0) {
    logError(`Can't find ${name}`);
    return null;
  } else {
    if (result.length > 1) {
      logWarning('not only one result');
    }
    for (const el of result) {
      if ($('.entry-title a', el).text().replace(/\s/g, '') == name) {
        return $('.archive-thumbnail > a > img', el).attr('data-src')!;
      }
    }
    logError(`${name} not match!`);
    return null;
  }
};
const test = async (name: string) => {
  console.log(await getPhoto(name));
};
const main = async () => {
  let info = YAML.parse(fs.readFileSync(SEIYUU_INFO_PATH, 'utf-8'));
  fs.open(SEIYUU_NEW_INFO_PATH, 'a+', async (error, fd) => {
    let scrapedPhoto = YAML.parse(fs.readFileSync(fd, 'utf-8'));
    if (scrapedPhoto == null) {
      scrapedPhoto = {};
    }
    for (const key in info) {
      // if (scrapedPhoto[key].hasOwnProperty('photo')) {
      //   continue;
      // }
      let name = info[key].jaName;
      name =
        typeof name == 'string'
          ? name
          : (name as string[][]).reduce((p, c) => (p = p + c[0]), '');
      await getPhoto(name)
        .then((v) => (info[key].photo = v))
        .catch((e) => {
          logError(e);
          fs.close(fd);
          process.exit(0);
        });
      try {
        fs.appendFileSync(fd, YAML.stringify({ [key]: info[key] }), 'utf-8');
        log(`${name} write success!`);
      } catch (error) {
        logError(error as any);
        fs.close(fd);
      }
      await randomTimeShort();
    }
    fs.close(fd);
  });
};
if (require.main === module) {
  if (process.argv[2]) {
    test(process.argv[2]);
  } else {
    main();
  }
}
