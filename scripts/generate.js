/* global process */
/* eslint-disable import/no-nodejs-modules, import/no-commonjs */
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const DB_SITE = process.env.REACT_APP_DB_SITE;
const DB_REP = './public/data';
const FILE_LIST = 'file_list.json';

const F_BEAST = 'F_BEAST_MST';
const F_BEAST_BOARD = 'F_BEAST_BOARD_PIECE_MST';
const F_BEAST_CP = 'F_BEAST_CP_MST';
const F_ABILITIES = 'F_ABILITY_MST';
const F_ABILITIES_EXPLAIN = 'F_ABILITY_EXPLAIN_MST';
const F_MAGICS = 'F_MAGIC_MST';
const F_MAGICS_EXPLAIN = 'F_MAGIC_EXPLAIN_MST';

const F_BEAST_NAMES = 'MST_BEAST_NAME';

let D_BEAST = null;
let D_BEAST_NAMES = null;
let D_BEAST_CP = null;
let D_BEAST_BOARD = null;
const D_ABILITIES = {};
const D_MAGICS = {};
let db = null;

const region = process.argv[2] || 'global';
const useCache = process.argv[3] !== 'false';

const DB_LOCAL_FILE = `db/${region}.json`;

let files = [];

const createTradHash = data => {
  const langs = [null, 'en', 'zh', 'ko', 'fr', 'de', 'es'],
    hash = {};
  data.forEach((v, k) => {
    if (k > 0) {
      hash[langs[k]] = v;
    }
  });
  return hash;
};

const getFile = fName => {
  let file = null;
  files.forEach(f => {
    if (f.Name === fName && f.Region === region) file = f;
  });
  return file;
};

const getFileName = fName => {
  const f = getFile(fName);
  if (!f) return null;
  return `${DB_SITE}${region}/${fName}/${f.FileVersion}/${fName}.${f.IsLocalizedText
    ? 'txt'
    : 'json'}`;
};

const getTmpFile = url => `./tmp/${url.replace(/\//g, '_').replace(/:/g, '')}`;

const getContent = (url, noJSON = false) => {
  const tmpFile = getTmpFile(url);
  if (useCache && fs.existsSync(tmpFile)) {
    return new Promise(resolve => {
      fs.readFile(tmpFile, 'utf8', (error, data) => {
        if (error) {
          process.stderr.write(`dafuck can't read ${tmpFile}\n`);
          process.stderr.write(`${error}\n`);
          process.exit(-3);
        }
        resolve(noJSON ? data : JSON.parse(data));
      });
    });
  }
  return axios
    .get(url)
    .then(
      res =>
        new Promise(resolve => {
          fs.writeFile(
            tmpFile,
            noJSON ? res.data : JSON.stringify(res.data),
            err => {
              if (err) {
                process.stderr.write(`Can't write in file ${tmpFile}\n`);
                process.stderr.write(`${err}\n`);
                process.stderr.write(`Pursuing...\n`);
              }
              resolve(res.data);
            }
          );
        })
    )
    .catch(err => process.stderr.write(`${err}\n`));
};

const getFileContent = (fName, noJSON = false) =>
  getContent(getFileName(fName), noJSON);

const getType = type => {
  let val = type;
  switch (type) {
    case '10':
      val = 'HP';
      break;
    case '11':
      val = 'MP';
      break;
    case '12':
      val = 'ATK';
      break;
    case '13':
      val = 'DEF';
      break;
    case '14':
      val = 'MAG';
      break;
    case '15':
      val = 'SPR';
      break;
    case '21':
      val = 'ABILITY';
      break;
    case '20':
      val = 'MAGIC';
      break;
    case '100':
      val = 'RES_FIRE';
      break;
    case '101':
      val = 'RES_ICE';
      break;
    case '102':
      val = 'RES_LIGHTNING';
      break;
    case '103':
      val = 'RES_WATER';
      break;
    case '104':
      val = 'RES_WIND';
      break;
    case '105':
      val = 'RES_EARTH';
      break;
    case '106':
      val = 'RES_LIGHT';
      break;
    case '107':
      val = 'RES_DARK';
      break;
  }
  return val;
};

const saveInDb = (name, data) => {
  process.stdout.write(`Writting ${name}...`);
  fs.writeFileSync(`${DB_REP}/${region}.${name}.json`, JSON.stringify(data));
  process.stdout.write('OK\n');
};

process.stdout.write('Getting file list...');
getContent(`${DB_SITE}/${FILE_LIST}`)
  .then(res => {
    process.stdout.write('OK\n');

    files = res;

    // Generate esper DBs
    const proms = [
      new Promise(resolve => {
        fs.readFile(DB_LOCAL_FILE, 'utf8', (error, data) => {
          if (error) {
            process.stderr.write(`dafuck can't read ${DB_LOCAL_FILE}\n`);
            process.stderr.write(`${error}\n`);
            process.exit(-3);
          }
          resolve(JSON.parse(data));
        });
      }).then(res => (db = res)),
      getFileContent(F_BEAST).then(res => (D_BEAST = res)),
      getFileContent(F_BEAST_BOARD).then(res => (D_BEAST_BOARD = res)),
      getFileContent(F_BEAST_CP).then(res => (D_BEAST_CP = res)),
      getFileContent(F_ABILITIES).then(res =>
        res
          .map(a => a.ABILITY_ID)
          .forEach(
            (id, key) =>
              (D_ABILITIES[id] = Object.assign(D_ABILITIES[id] || {}, res[key]))
          )
      ),
      getFileContent(F_MAGICS).then(res =>
        res
          .map(a => a.MAGIC_ID)
          .forEach(
            (id, key) =>
              (D_MAGICS[id] = Object.assign(res[key], D_MAGICS[id] || null))
          )
      ),
      getFileContent(F_ABILITIES_EXPLAIN).then(res =>
        res
          .map(a => a.ABILITY_ID)
          .forEach(
            (id, key) =>
              (D_ABILITIES[id] = Object.assign(D_ABILITIES[id] || {}, res[key]))
          )
      ),
      getFileContent(F_MAGICS_EXPLAIN).then(res =>
        res
          .map(a => a.MAGIC_ID)
          .forEach(
            (id, key) =>
              (D_MAGICS[id] = Object.assign(res[key], D_MAGICS[id] || null))
          )
      )
    ];

    if (region === 'global') {
      proms.push(
        getFileContent(F_BEAST_NAMES, true).then(
          res => (D_BEAST_NAMES = res.trim().split('\n'))
        )
      );
    }

    process.stdout.write('Getting needed files for espers...');
    Promise.all(proms).then(() => {
      process.stdout.write('OK\n');

      const abilities = {},
        espers = {},
        magics = {};
      D_BEAST.forEach(e => {
        if (db.espers[e.BEAST_ID]) {
          espers[e.BEAST_ID] = Object.assign(db.espers[e.BEAST_ID], {
            id: e.BEAST_ID,
            order: parseInt(e.DICTIONARY_INDEX, 10),
            names: {
              jp: e.NAME
            }
          });
        }
      });

      if (region === 'global') {
        D_BEAST_NAMES.forEach(l => {
          const data = l.split('^'),
            id = data[0].split(`${F_BEAST_NAMES}_`)[1];
          if (espers[id]) {
            Object.assign(espers[id].names, createTradHash(data));
          }
        });
      }

      // Small
      saveInDb('espers', espers);

      // CPs
      D_BEAST_CP.forEach(l => {
        const code = l['5hqFc4ey'],
          id = code.substring(0, code.length - 1),
          rarity = code.substring(code.length - 1);
        const cps = l.hbm8t3uK
          .split(',')
          .map(n => (n !== '' ? parseInt(n) : null))
          .filter(n => n !== null);
        if (espers[id]) {
          if (!espers[id].cps) espers[id].cps = {};
          espers[id].cps[rarity] = cps;
        }
      });

      // Board
      D_BEAST_BOARD.forEach(l => {
        const [x, y] = l['1XRtI2d9'].split(':').map(n => parseInt(n)),
          cost = parseInt(l['0A1BkNWb'], 10),
          id = l.BEAST_ID,
          pieceId = l.BEAST_PIECE_ID,
          type = getType(l.BEAST_PIECE_TYPE);
        if (espers[id]) {
          if (!espers[id].board) espers[id].board = {};
          espers[id].board[pieceId] = {
            children: l.BEAST_PIECE_CONNECTIONS
              .split(',')
              .filter(n => n && n !== ''),
            cost,
            id: pieceId,
            parendId: null,
            position: { x, y },
            rarity: l.UNIT_RARITY,
            reward: type !== '0' ? [type, l.BEAST_ABILITY_ID] : null
          };
          if (type === 'ABILITY') {
            abilities[l.BEAST_ABILITY_ID] = D_ABILITIES[l.BEAST_ABILITY_ID];
          }
          if (type === 'MAGIC') {
            magics[l.BEAST_ABILITY_ID] = D_MAGICS[l.BEAST_ABILITY_ID];
          }
        }
      });
      D_BEAST_BOARD.forEach(l => {
        const children = l.BEAST_PIECE_CONNECTIONS.split(','),
          id = l.BEAST_ID,
          pieceId = l.BEAST_PIECE_ID;
        if (espers[id])
          children
            .filter(n => n && n !== '')
            .forEach(c => (espers[id].board[c].parentId = pieceId));
      });
      // Abilities
      saveInDb('espers.abilities', abilities);
      saveInDb('espers.magics', magics);

      // Saving
      //console.log(espers);
      Object.keys(espers).forEach(k => {
        saveInDb(`esper.${espers[k].id}`, espers[k]);
      });
      process.stdout.write('Done!\n');
    });
  })
  .catch(err => {
    process.stderr.write(`${err}\n`);
  });
