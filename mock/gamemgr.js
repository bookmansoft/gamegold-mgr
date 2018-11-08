import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    gameId: i,
    gameName: `王者荣耀 ${i}`,
    gameTypeNames: [
      '休闲益智 ',
      '角色扮演 ',
      '设计 '
    ],
    gameState: Math.floor(Math.random() * 10) % 4,
    gameStateName: '已上架f',
    createdAt: new Date(`2018-11-${Math.floor(i / 2) + 1}`),
    progress: Math.ceil(Math.random() * 100),
  });
}

function getGameList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

function postGameList(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        href: 'https://ant.design',
        avatar: [
          'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
          'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        ][i % 2],
        name: `db32860831c3cef7760699a02ee10838 ${i}`,
        title: `一个任务名称 ${i}`,
        owner: '曲丽丽',
        desc,
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { desc, name });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  return res.json(result);
}

function getWalletInfo(req, res, u) {
  const result2 = {
        walletAccount: '5d4b9d8c-0a58-4f5e-ace3-f576c74afb75',
        createAt: '2018-11-5 17:30:46',
        walletSecure: '已备份',
    };

  return res.json(result2);
}




const gameDataJson={
    gameState:2,
    publishDate:'2017-11-08 10:23:22',
    auditDate:'2017-12-02 09:21:12',
    onlineDate:'',
    offlineDate:'',
    
    gameName:'英雄联盟',
    gameTypeNames:'修仙 休闲',
    developerName:'张祖钦工作室',
    createAt:'2018-11-4 21:05:26',
    contactAddress:'显示完整简介内容，支持换行。显示完整简介内。显示完整简介内容，支内容，支持换行。显示完整简介内容，支持换行。',
    currentVersion:'V1.2.3',
    updateAt:'2018-9-10',
    updateContent:'显示完整简介内容，支持换行。显示完整简介内容，支持换行。显示完整简介内容，支持换行。',
    gameIcon:'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
    gameFacePicture:'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
    gamePictures:[
        'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
        'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
        'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
        'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
        'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
    ]
};

export default {
  'GET /gamemgr/query': getGameList,
  'POST /gamemgr/query': postGameList,
  'POST /gamemgr/add': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /gamemgr/view': gameDataJson,
};
