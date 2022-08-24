const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const YAML = require('yaml');

const SEIYUU_INFO = 'seiyuu-info.yaml';
fs.readFile(path.resolve(__dirname, '../', SEIYUU_INFO), 'utf-8', (err, data) => {
  let ydata = YAML.parse(data);
  let newKeys = Object.keys(ydata).sort((a, b) => a.localeCompare(b));
  let jdata = {};
  for (const key of newKeys) {
    jdata[key] = _.omit(ydata[key], 'check');
    jdata[key].zhName = key;
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../', 'seiyuu-info.json'),
    JSON.stringify(jdata),
    'utf-8'
  );
});
