import { stockRecord, queryStockList, stockPurchase, auctionStock, bidStock, sendStock, queryMyStock, queryStockBase } from '@/services/gamegoldapi';

/**
 * 先定义数据仓库再输出，这是为了方便调用本地查询
 */
let store = {
  namespace: 'stocklist',

  state: {
    //一级市场凭证条目反向索引
    records: {},
    //一级市场凭证条目列表
    data: {
      list: [],
      pagination: {},
    },
    //二级市场凭证条目反向索引
    stockMap: {},
    //二级市场凭证条目列表
    stockList: {
      list: [],
      pagination: {},
    },
    tableData: {
      list: [],
      pagination: {},
    },
    myStock: {},
  },

  effects: {
    queryDetail({ payload }, {call, put}) {
      if(payload.type == 1) {
        return store.state.records[payload.id];
      } else {
        return store.state.stockMap[payload.id];
      }
    },

    *getStockExchange({ payload }, { call, put }) {
      const response = yield call(queryStockList, payload);
      if(!!response && response.code == 0) {
        yield put({
          type: 'saveStockExchange',
          payload: response.data,
        });
      }
    },

    *purchase({ payload }, { call, put }) {
      return yield call(stockPurchase, payload);
    },

    *fetchTableData({ payload }, { call, put }) {
      const response = yield call(stockRecord, payload);
      if(response.code == 0) {
        yield put({
          type: 'saveTableData',
          payload: response.data,
        });
      }
    },
    *getStockOri({ payload }, { call, put }) {
      const response = yield call(queryStockBase, payload);
      if(response.code == 0) {
        yield put({
          type: 'saveStockOri',
          payload: response.data,
        });
      }
    },

    *mystock({ payload }, { call, put }) {
      const response = yield call(queryMyStock, payload);
      if(response.code == 0) {
        yield put({
          type: 'saveMyStock',
          payload: response.data,
        });
      }
    },

    *sendstock({ payload }, { call, put }) {
      yield call(sendStock, payload);
    },

    *auctionstock({ payload }, { call, put }) {
      yield call(auctionStock, payload);
    },

    *bidstock({ payload }, { call, put }) {
      yield call(bidStock, payload);
    },
  },

  reducers: {
    /**
     * 获取一级市场凭证条目列表
     * @param {*} state 
     * @param {*} action 
     */
    saveStockOri(state, action) {
      //建立反向索引
      action.payload.list.map(it=>{
        state.records[it.cid] = it;
      });
      return {
        ...state,
        data: action.payload,
      };
    },
    saveStockExchange(state, action) {
      //建立反向索引
      action.payload.list.map(item => {
        state.stockMap[item.cpid] = item;
      });
      return {
        ...state,
        stockList: action.payload,
      };
    },
    saveTableData(state, action) {
      return {
        ...state,
        tableData: action.payload,
      };
    },
    saveMyStock(state, action) {
      return {
        ...state,
        myStock: action.payload,
      }
    },
  },
}

export default store;
