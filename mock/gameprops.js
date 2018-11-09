import mockjs from 'mockjs';
import { parse } from 'url';
// 代码中会兼容本地 service mock 以及部署站点的静态数据
// mock tableListDataSource
function getList(cur = 1, pageSize = 10) {
  var myDate = new Date();
  let tableListDataSource = [];
  let type_cap = ["装备","消耗","装饰","其他"];
  for (let i = 0; i < pageSize; i++) {
    tableListDataSource.push({
      id: `${cur}${i}`,
      disabled: i % 6 === 0,
      name: `三级头盔 ${cur}-${i}`,
      type: Math.floor(Math.random() * 10),
      type_cap: type_cap[Math.floor(Math.random()*type_cap.length)],
      game: `守望先锋 ${cur}-${i}`,
      desc: `这是${cur}-${i}的一段描述`,
      num: Math.floor(Math.random() * 1000),
      stock: Math.floor(Math.random() * 1000),
      status: Math.floor(Math.random() * 10) % 4,
      updatedAt: myDate.setDate(myDate.getDate() + i),
      createdAt: myDate.setDate(myDate.getDate() + i),
    });
  }
  return tableListDataSource;
}


function getGamePropsList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = getList(params.currentPage, params.pageSize);

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.id) {
    dataSource = dataSource.filter(data => data.id.indexOf(params.id) > -1);
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  if (params.game) {
    dataSource = dataSource.filter(data => data.game.indexOf(params.game) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: 200,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}


function getUserAllList(cur = 1, pageSize = 10) {
  var myDate = new Date();
  let userAll = [];
  let type_cap = ["射击"," MOBA","休闲益智","动作冒险","角色扮演"];
  for (let i = 0; i < 50; i++) {
    userAll.push({
      key: i,
      id: `${cur}${i}`,
      walletAddr: `tb1qk879kgs5pl994fdnvr${cur}-${i}`,
      gameType: type_cap[Math.floor(Math.random()*type_cap.length)],
      game: `王者农药${cur}${i}`,
      createdAt: myDate.setDate(myDate.getDate() + i),
    });
  }
  return userAll;
}

function getUserAll(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = getUserAllList(params.currentPage, params.pageSize);

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.id) {
    dataSource = dataSource.filter(data => data.id.indexOf(params.id) > -1);
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.gameType.indexOf(params.gameType) > -1);
  }

  if (params.game) {
    dataSource = dataSource.filter(data => data.game.indexOf(params.game) > -1);
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



function getAllGame(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  var myDate = new Date();
  let allGame = [];
  let type_cap = ["TD塔防","魔兽世界","王者农药","荒野行动"];
  for (let i = 1; i < 20; i++) {
    allGame.push({
      id: `${i}`,
      type: Math.floor(Math.random() * 10),
      name: type_cap[Math.floor(Math.random()*type_cap.length)] + `版本`+i,
      desc: `这是${i}游戏的一段描述`,
      status: Math.floor(Math.random() * 10) % 4,
      updatedAt: myDate.setDate(myDate.getDate() + i),
      createdAt: myDate.setDate(myDate.getDate() + i),
    });
  }
  return res.json(allGame);
}


function getPropsByGame(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let gameId = params.id || '';
  let gameName = params.name || '';
  var myDate = new Date();
  let gameProps = [];
  let type_cap = ["装备","消耗","装饰","其他"];
  for (let i = 1; i < 10; i++) {
    gameProps.push({
      id: `${i}`,
      gameId: gameId,
      name: `${gameName}-`+type_cap[Math.floor(Math.random()*type_cap.length)],
      type: Math.floor(Math.random() * 10),
      desc: `这是${i}道具一段描述`,
      num: Math.floor(Math.random() * 1000),
      stock: Math.floor(Math.random() * 1000),
      status: Math.floor(Math.random() * 10) % 4,
      updatedAt: myDate.setDate(myDate.getDate() + i),
      createdAt: myDate.setDate(myDate.getDate() + i),
    });
  }
  return res.json(gameProps);
}

function getGamePropsDetail(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  var myDate = new Date();
  let type_cap = ["装备","消耗","装饰","其他"];
  let cur = 1;
  let i = params.id || 0;
  let detailDataSource = {
    id: `${cur}${i}`,
    disabled: i % 6 === 0,
    name: `三级头盔 ${cur}-${i}`,
    type: Math.floor(Math.random() * 10),
    type_cap: type_cap[Math.floor(Math.random()*type_cap.length)],
    game: `守望先锋 ${cur}-${i}`,
    desc: `这是${cur}-${i}的一段描述`,
    num: Math.floor(Math.random() * 1000),
    unstock: Math.floor(Math.random() * 1000),
    stock: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: myDate.setDate(myDate.getDate() + i),
    createdAt: myDate.setDate(myDate.getDate() + i),
    iconImg: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
    moreImg: ['https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png','https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png','https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png','https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png']
  };
  return res.json(detailDataSource);
}

export default {
  'GET /api/gamepropslist': getGamePropsList,
  'GET /api/gamepropsdetail': getGamePropsDetail,
  'GET /api/allgame': getAllGame,
  'GET /api/gameprops': getPropsByGame,
  'GET /api/userall': getUserAll,
};

