export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },

  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // operatormgr
      {
        path: '/operator',
        name: 'operator',
        icon: 'table',
        authority: ['admin'],
        routes: [
          {
            path: '/operator/operatorlist',
            name: 'operatorlist',
            component: './Operator/OperatorList',
          },
          {
            path: '/operator/operatoradd',
            name: 'operatoradd',
            component: './Operator/OperatorAdd',
          },
          {
            path: '/operator/operatorpassword',
            name: 'operatopassword',
            component: './Operator/OperatorPassword',
          },
          {
            path: '/operator/operatoraddsuccess',
            name: 'operatoraddsuccess',
            component: './Operator/OperatorAddSuccess',
            hideInMenu: true,
          },
          {
            path: '/operator/operatoradderror',
            name: 'operatoradderror',
            component: './Operator/OperatorAddError',
            hideInMenu: true,
          },
          {
            path: '/operator/operatorpasswordsuccess',
            name: 'operatorpasswordsuccess',
            component: './Operator/OperatorPasswordSuccess',
            hideInMenu: true,
          },
        ],
      },
      // usermgr
      {
        path: '/usermgr',
        name: 'usermgr',
        icon: 'table',
        authority: ['user'],
        routes: [
          {
            path: '/usermgr/userlist',
            name: 'userlist',
            component: './UserMgr/UserList',
          },
        ],
      },
      // gamemgr
      {
        path: '/gamemgr',
        name: 'gamemgr',
        icon: 'table',
        authority: ['user'],
        routes: [
          {
            path: '/gamemgr/gamelist',
            name: 'gamelist',
            component: './GameMgr/GameList',
          },
          {
            path: '/gamemgr/gameadd',
            name: 'gameadd',
            component: './GameMgr/GameAdd',
          },
          {
            path: '/gamemgr/gameview',
            name: 'gameview',
            component: './GameMgr/GameView',
            hideInMenu: true,
          },
          {
            path: '/gamemgr/gameaddsuccess',
            name: 'gameaddsuccess',
            component: './GameMgr/GameAddSuccess',
            hideInMenu: true,
          },
          {
            path: '/gamemgr/gameadderror',
            name: 'gameadderror',
            component: './GameMgr/GameAddError',
            hideInMenu: true,
          },
        ],
      },
      {
        name: 'gameprops',
        icon: 'build',
        path: '/gameprops',
        authority: ['user'],
        routes: [
          {
            path: '/gameprops/list',
            name: 'propslist',
            component: './GameProps/PropsList',
          },
          {
            path: '/gameprops/detail/:id',
            name: 'propsdetail',
            component: './GameProps/PropsDetail',
            hideInMenu: true,
          },
          {
            path: '/gameprops/edit/:id',
            name: 'propsdetail',
            component: './GameProps/propsEdit',
            hideInMenu: true,
          },
          {
            path: '/gameprops/create',
            name: 'propscreate',
            component: './GameProps/PropsCreate',
          },
          {
            path: '/gameprops/produce',
            name: 'propsproduce',
            component: './GameProps/PropsProduce',
          },
          {
            path: '/gameprops/produce/:id',
            name: 'propsproduce',
            component: './GameProps/PropsProduce',
            hideInMenu: true,
          },
          {
            path: '/gameprops/present/:id',
            name: 'propspresent',
            component: './GameProps/PropsPresent',
            hideInMenu: true,
          },
          {
            path: '/gameprops/present',
            name: 'propspresent',
            component: './GameProps/PropsPresent',
          }
        ],
      },
      // wallet
      {
        path: '/wallet',
        name: 'wallet',
        icon: 'table',
        routes: [
          {
            path: '/wallet/walletmgr',
            name: 'walletmgr',
            component: './Wallet/WalletMgr',
            authority: ['admin','user'],
          },
          {
            path: '/wallet/step-form',
            name: 'walletstep',
            component: './Wallet/StepForm',
            authority: ['admin'],
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/wallet/step-form',
                name: 'stepform',
                redirect: '/wallet/step-form/info',
              },
              {
                path: '/wallet/step-form/info',
                name: 'info',
                component: './Wallet/StepForm/WalletStep1',
              },
              {
                path: '/wallet/step-form/confirm',
                name: 'confirm',
                component: './Wallet/StepForm/WalletStep2',
              },
              {
                path: '/wallet/step-form/result',
                name: 'result',
                component: './Wallet/StepForm/WalletStep3',
              },
            ],
          },
          {
            path: '/wallet/walletlog',
            name: 'walletlog',
            component: './Wallet/WalletLog',
            hideInMenu: true,
          },
          {
            path: '/wallet/walletinfo',
            name: 'walletinfo',
            component: './Wallet/WalletInfo',
            authority: ['admin','user'],
          },
          {
            path: '/wallet/walletpay',
            name: 'walletpay',
            component: './Wallet/WalletPay',
            authority: ['admin','user'],
          },
          {
            path: '/wallet/walletpaysuccess',
            name: 'walletpaysuccess',
            component: './Wallet/WalletPaySuccess',
            hideInMenu: true,
          },
          {
            path: '/wallet/walletpayerror',
            name: 'walletpayerror',
            component: './Wallet/WalletPayError',
            hideInMenu: true,
          },
        ],
      },


      //---------------------------------------------------------------------------

      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        hideInMenu: true,
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        hideInMenu: true,
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                name: 'stepform',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        hideInMenu: true,
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/game-list',
            name: 'gamelist',
            component: './List/GameList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        hideInMenu: true,
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu: true,
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },


      {
        component: '404',
      },
    ],
  },
];
