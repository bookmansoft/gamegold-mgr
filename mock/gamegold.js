/**
 * Gamegold 对等网络模拟交互接口，由 remoting 方法发起
 * @description 代码中会兼容本地 service mock 以及部署站点的静态数据(例如GET方法, 但POST不行)
 * @description 当前版本，必须通过 npm run start:no-mock 命令启动系统，才能禁用mock、完全启用 config.js 中的代理配置(proxy)
 */
export default {
    'GET /api/execute/public/blocks' : {"blocks":[{"height":1000,"size":441,"virtualSize":414,"hash":"0a4666241e3c3db8f58b9572ec6a81a42f73d26cbc6295587cb07377c5060000","txlength":1,"poolInfo":{}},{"height":6692,"size":441,"virtualSize":414,"hash":"9816d4345b3cbcfa6d12d8a2cc53fa18fa969694de059d10fd94317f81020000","txlength":1,"poolInfo":{}},{"height":6691,"size":441,"virtualSize":414,"hash":"039223f1ab9eebaaf3071368b12a076fac444aed348d3f5de31c40c25f050000","txlength":1,"poolInfo":{}},{"height":6690,"size":441,"virtualSize":414,"hash":"0d983dd8cc752ee234622e5474e991518b1f76301199093a9ab9091b60030000","txlength":1,"poolInfo":{}},{"height":6689,"size":441,"virtualSize":414,"hash":"512636215ce7fbc0b98e4e8f0b5b7e6aef726d26296eaa61228940e569070000","txlength":1,"poolInfo":{}},{"height":6688,"size":441,"virtualSize":414,"hash":"6edd86c61a3bc7b114b9dceecb035e227d889f552d5e21be7135780935070000","txlength":1,"poolInfo":{}},{"height":6687,"size":441,"virtualSize":414,"hash":"8b388e39f074ec5e840b800ad06486fde964fd1923f465b5fb38492d95010000","txlength":1,"poolInfo":{}},{"height":6686,"size":441,"virtualSize":414,"hash":"302d321273c1ac2d96f7ff1ced6511e7a9c600ecc731f5e62b37c208ce050000","txlength":1,"poolInfo":{}},{"height":6685,"size":441,"virtualSize":414,"hash":"e518ab62adcf2784b864722598bca7e5c8ea683f278ec40ae43b7f7ba2030000","txlength":1,"poolInfo":{}},{"height":6684,"size":441,"virtualSize":414,"hash":"da0299cc6996acc6ce90e1a3c603834eed1eb198a744f1ac91df88dbb5000000","txlength":1,"poolInfo":{}}],"length":10,"pagination":{"next":"2018-10-22","prev":"2018-10-20","currentTs":1540166399,"current":"2018-10-21","isToday":true,"more":true,"moreTs":1540166400}},
    'POST /api/execute': (req, res) => { 
      //添加跨域请求头
      res.setHeader('Access-Control-Allow-Origin', '*');

      const { method } = req.body;
      if (method === 'token.random') {
        res.send({
          error: null,
          result: 'f1573c53d45441e7d38b1e06ff3687bc26f716b0af06bc6cd219fb3768406087',
        });
      }
      else if (method === 'sys.testlist') {
        res.send({
          error: null,
          result: [
            {
              'id': 1,
              'title': '百晓生',
              'description': '优秀的游戏发行商',
              'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
              'cid':'xxxxxxxx-game-gold-test-xxxxxxxxxxxx',
              'name':'test', 
              'url':'920.cc', 
              'ip':'*', 
              'current':{
                'hash': 'f1573c53d45441e7d38b1e06ff3687bc26f716b0af06bc6cd219fb3768406087',
                'index': 0,
                'address': 'tb1qpmzc83qca4snn62ee0eul8rqtzrp5a5q0f96rs'
              }, 
              'owned': true, 
              'status': 1
            },
            {
              'id': 2,
              'title': '百谷王',
              'description': '优秀的游戏生态建设者',
              'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
              'cid':'xxxxxxxx-game-gold-test-xxxxxxxxxxxx',
              'name':'test', 
              'url':'920.cc', 
              'ip':'*', 
              'current':{
                'hash': 'f1573c53d45441e7d38b1e06ff3687bc26f716b0af06bc6cd219fb3768406087',
                'index': 0,
                'address': 'tb1qpmzc83qca4snn62ee0eul8rqtzrp5a5q0f96rs'
              }, 
              'owned': true, 
              'status': 1
            }
          ],
        });
      }
      return;
    },
  };
  