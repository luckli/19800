
function configRouter(){
   var route = [
      //{path: '/', component: {template: '<router-view></router-view>'}},
      {path: '/login', name: 'login', component: require('./components/login')},
      {path: '/main', name: 'main', component: require('./components/main'),children: [
         { path: 'modAdmin', component: require('./components/main/modAdmin') },
         { path: 'modFinancial', component: require('./components/main/modFinancial') },
         { path: 'modManage', component: require('./components/main/modManage') },
         { path: 'modAuth/:Id', name: 'modAuth', component: require('./components/main/modAuth') },
         { path: 'modRole', component: require('./components/main/modRole') },
         { path: 'modRoleAuth/:Id', name: 'modRoleAuth', component: require('./components/main/modRoleAuth') },
         { path: 'modUser', component: require('./components/main/modUser') },
         { path: 'buzAccount', component: require('./components/main/buzAccount') },
         { path: 'buzMarketDepth', component: require('./components/main/buzMarketDepth') },
         { path: 'buzTradeVolume', component: require('./components/main/buzTradeVolume') },
         { path: 'buzTradeList', component: require('./components/main/buzTradeList') },
         { path: 'buzExtraBudget', component: require('./components/main/buzExtraBudget') },
         { path: 'buzLevel', component: require('./components/main/buzLevel') },
         { path: 'buzApply', component: require('./components/main/buzApply') },
         { path: 'cashCnyTask', component: require('./components/main/cashCnyTask') },
         { path: 'cashCnyListPending', component: require('./components/main/cashCnyListPending') },
         { path: 'cashCnyList', component: require('./components/main/cashCnyList') },
         { path: 'cashCoinList', component: require('./components/main/cashCoinList') },
         { path: 'cashCoinListPending', component: require('./components/main/cashCoinListPending') },
         { path: 'rcgRechargeList', component: require('./components/main/rcgRechargeList') },
         { path: 'rcgCnyPending', component: require('./components/main/rcgCnyPending') },
         { path: 'rcgCoinList', component: require('./components/main/rcgCoinList') },
         { path: 'msgModule/:Id',name: 'msgModule', component: require('./components/main/msgModule') },
         { path: 'msgTrigger', component: require('./components/main/msgTrigger') },
         { path: 'sysCurrency', component: require('./components/main/sysCurrency') },
         { path: 'sysCapitalAccount', component: require('./components/main/sysCapitalAccount') },
      ]},
      {path: '*', redirect: '/login'}
   ];
   return route;
}
module.exports = configRouter;