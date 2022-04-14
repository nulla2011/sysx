import * as fs from 'fs';
import axios, { AxiosResponse } from 'axios';
import UserAgent from 'user-agents';
import { parseWiki } from './parse-wikitext';

const MOEGIRL_API = new URL('https://zh.moegirl.org.cn/api.php');
const SEIYUU_LIST = "seiyuu-list_constrict1.csv";
interface Iparams {
    [key: string]: string
}
const params: Iparams = {
    action: 'query',
    format: 'json',
    prop: 'revisions',
    rvprop: 'content',
}
for (const key in params) {
    MOEGIRL_API.searchParams.set(key, params[key])
}
class seiyuu {
    constructor(name: string, origName: string) { }
}
const getWikiData = (data: any): string => {
    let pages = data.query.pages;
    return pages[Object.keys(pages)[0]].revisions[0]["*"];
};
const main = async (arg: string) => {
    let l = fs.readFileSync(__dirname + '/' + SEIYUU_LIST, 'utf-8').split('\n');
    let start = arg ? parseInt(arg) - 1 : Math.floor(Math.random() * 694);
    for (let i = start; i < start + 4; i++) {
        let name = decodeURI(l[i].split(',')[1].trim().replace('https://zh.moegirl.org.cn/', ''));   //有些有歧义的会备注声优
        MOEGIRL_API.searchParams.set('titles', name);
        let response: AxiosResponse;
        try {
            response = await axios.get(MOEGIRL_API.href, {
                headers: {
                    'user-agent': new UserAgent().toString()
                }
            });
        } catch (error) {
            console.error(`${error}`);
            process.exit(0);
        }
        if (response.headers['content-type'].includes('text/html')) {
            console.log(`你被拉黑了！停在了 ${response.config.url}`);
            process.exit(0);
        }
        let wikiText = getWikiData(response.data);
        try {
            console.log(parseWiki(wikiText));
        } catch (error) {
            console.error(`${name} ${error}`);
        }
    };
};

main(process.argv[2]);