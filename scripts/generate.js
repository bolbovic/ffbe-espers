const axios = require('axios');
const fs = require('fs');

const DB_SITE = 'http://diffs.exviusdb.com/data_files/'
const DB_REP = './public/data'
const FILE_LIST = 'file_list.json';

const F_BEAST = 'F_BEAST_MST';
const F_BEAST_NAMES = 'MST_BEAST_NAME';
const F_BEAST_BOARD = 'F_BEAST_BOARD_PIECE_MST';
const F_BEAST_CP = 'F_BEAST_CP_MST';

let D_BEAST = null;
let D_BEAST_NAMES = null;
let D_BEAST_CP = null;
let D_BEAST_BOARD = null;

const region = process.argv[2] || 'global';
const useCache = process.argv[3] !== 'false';

let files = [];

const createTradHash = data => {
  const langs  = [ null, 'en', 'zh', 'ko', 'fr', 'de', 'es'];
  let hash = {};
  data.forEach( (v,k) => {
    if ( k > 0 ) {
      hash[langs[k]] = v;
    }
  });
  return hash;
}

const getFile = fName => {
  let file = null;
  files.forEach( f => {
    if ( f.Name === fName && f.Region === region ) file = f;
  });
  return file;
}

const getFileName = fName => {
  const f = getFile(fName);
  if ( !f ) return null;
  return `${DB_SITE}${region}/${fName}/${f.FileVersion}/${fName}.${f.IsLocalizedText ? 'txt' : 'json'}`;
};

const getTmpFile = url => `./tmp/${url.replace(/\//g, '_').replace(/\:/g,'')}`;

const getContent = (url, noJSON = false) => {
  let tmpFile = getTmpFile(url);
  if ( useCache && fs.existsSync(tmpFile) ) {
    return new Promise( (resolve, reject) => {
      fs.readFile(tmpFile, 'utf8', (error, data) => {
        if ( error ) {
          console.log(`dafuck can't read ${tmpFile}`);
          console.log(error);
          process.exit(-3)
        }
        resolve(noJSON ? data : JSON.parse(data));
      })
    });
  } else {
    return axios.get(url).then( res => {
      return new Promise( resolve => {
        fs.writeFile(tmpFile, noJSON ? res.data : JSON.stringify(res.data), (err) => {
          if (err) {
            console.error(`Can't write in file ${tmpFile}`);
            console.error(error);
            console.error(`Pursuing...`);
          }
          resolve(res.data);
        });
      });
    }).catch(err => console.log(err));
  }
};

const getFileContent = (fName, noJSON = false) => {
  return getContent(getFileName(fName), noJSON);
}; 

process.stdin.write('Getting file list...');
getContent(`${DB_SITE}/${FILE_LIST}`).then(res => {
  process.stdin.write('OK\n');

  files = res;

  // Generate esper DBs
  let proms = [
    getFileContent(F_BEAST).then( res => D_BEAST = res ),
    getFileContent(F_BEAST_BOARD).then( res => D_BEAST_BOARD = res ),
    getFileContent(F_BEAST_CP).then( res => D_BEAST_CP = res ),
  ];

  if ( region === 'global' ) {
    proms.push(
      getFileContent(F_BEAST_NAMES, true).then(
        res => D_BEAST_NAMES = res.trim().split('\n') )
    )
  }

  process.stdin.write('Getting needed files for espers...');
  Promise.all( proms ).then( () => {
    process.stdin.write('OK\n');

    let espers = {};
    D_BEAST.forEach( e => {
      espers[e.BEAST_ID] = {
        board: {},
        cps: {},
        id: e.BEAST_ID,
        names: {
          jp: e.NAME
        }
      }
    })

    if ( region === 'global' ) {
      D_BEAST_NAMES.forEach( l => {
        let data = l.split('^');
        let id = data[0].split(`${F_BEAST_NAMES}_`)[1];
        if ( espers[id] ) {
          Object.assign(espers[id].names, createTradHash(data));
        }
      })
    }

    // Small 
    saveInDb('espers', espers);

    // CPs
    D_BEAST_CP.forEach( l => {
      const code = l['5hqFc4ey'],
        id = code.substring(0, code.length - 1),
        rarity = code.substring(code.length - 1);
      const cps = l['hbm8t3uK'].split(',').map( n => n !== '' ? parseInt(n) : null).filter( n => n != null);
      //console.log(code, id, rarity, cps.length);
      if ( espers[id] )
        espers[id].cps[rarity] = cps;
    });

    // Board
    D_BEAST_BOARD.forEach( l => {
      const [x, y] = l['1XRtI2d9'].split(':').map(n => parseInt(n)),
        cost = parseInt(l['0A1BkNWb'], 10),
        id = l.BEAST_ID,
        pieceId = l.BEAST_PIECE_ID;
      if (espers[id] ) {
        espers[id].board[pieceId] = {
          children: l.BEAST_PIECE_CONNECTIONS.split(',').filter( n => n && n !== ''),
          cost,
          id: pieceId,
          parendId: null,
          position: {x, y},
          rarity: l.UNIT_RARITY,
          reward: getType(l.BEAST_PIECE_TYPE) !== '0' ? [getType(l.BEAST_PIECE_TYPE), l.BEAST_ABILITY_ID] : null
        };
      }
    });
    D_BEAST_BOARD.forEach( l => {
      const children = l.BEAST_PIECE_CONNECTIONS.split(','),
        id = l.BEAST_ID,
        pieceId = l.BEAST_PIECE_ID;
      if ( espers[id] )
        children.filter( n => n && n !== '').forEach( c => espers[id].board[c].parentId = pieceId);
    });
    // Abilities

    // Saving
    //console.log(espers);
    Object.keys(espers).forEach( k => {
      saveInDb(`esper.${espers[k].id}`, espers[k]);
    })
    process.stdin.write('Done!\n');
  });

}).catch( err => {
  console.error(err);
});


const saveInDb = (name, data) => {
  process.stdin.write(`Writting ${name}...`);
  fs.writeFileSync(`${DB_REP}/${region}.${name}.json`, JSON.stringify(data));
  process.stdin.write('OK\n');
}

const getType = type => {
  let val = type;
  switch(type) {
    case '10' : val = 'HP'; break;
    case '11' : val = 'MP'; break;
    case '12' : val = 'ATK'; break;
    case '13' : val = 'DEF'; break;
    case '14' : val = 'MAG'; break;
    case '15' : val = 'SPR'; break;
    case '20' : val = 'ABILITY'; break;
    case '21' : val = 'MAGIC'; break;
    case '103': val = 'BOOST'; break;
  }
  return val;
}