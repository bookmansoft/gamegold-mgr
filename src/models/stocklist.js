import { stockRecord, queryStockList, stockPurchase, auctionStock, bidStock, sendStock, queryMyStock, queryStockBase } from '@/services/gamegoldapi';

export default {
  namespace: 'stocklist',

  state: {
    stockMap: {},
    stockList: {
      list: [],
      pagination: {},
    },
    tableData: {
      list: [],
      pagination: {},
    },
    data: {
      list: [],
      pagination: {},
    },
    records: {},
    myStock: {},
  },

  effects: {
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
    saveStockExchange(state, action) {
      //生成反向索引表，以便详情页面直接引用
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
    saveStockOri(state, action) {
      //建立本地数据集的反向索引
      action.payload.list.map(it=>{
        state.records[it.cid] = it;
      });
      return {
        ...state,
        data: action.payload,
      };
    },
    saveMyStock(state, action) {
      return {
        ...state,
        myStock: action.payload,
      }
    },
  },
};
