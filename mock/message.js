import mockjs from 'mockjs';
import { parse } from 'url';
// 代码中会兼容本地 service mock 以及部署站点的静态数据
// mock tableListDataSource
function getList(cur = 1, pageSize = 10) {
  var myDate = new Date();
  let tableListDataSource = [];
  for (let i = 0; i < pageSize; i++) {
    tableListDataSource.push({
      id: i,
      disabled: i % 6 === 0,
      name: `TradeCode ${cur}-${i}`,
      title: `一个任务名称 ${cur}-${i}`,
      desc: `这是${cur}-${i}的一段描述`,
      callNo: Math.floor(Math.random() * 1000),
      status: Math.floor(Math.random() * 10) % 4,
      updatedAt: myDate.setDate(myDate.getDate() + i),
      createdAt: myDate.setDate(myDate.getDate() + i),
      progress: Math.ceil(Math.random() * 100),
    });
  }
  return tableListDataSource;
}

function getAllMessage(req, res, u) {
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
      total: 200,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

export default {
  // 支持值为 Object 和 Array
  'GET /api/message_list': getAllMessage,
};
