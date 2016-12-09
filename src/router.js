
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
         { path: 'cashCnyTask', component: require('./components/main/cashCnyTask') },
         { path: 'cashCoinList', component: require('./components/main/cashCoinList') },
         { path: 'rcgRechargeList', component: require('./components/main/rcgRechargeList') },
         { path: 'rcgCnyPending', component: require('./components/main/rcgCnyPending') },
         { path: 'rcgCoinList', component: require('./components/main/rcgCoinList') },
         { path: 'sysCurrency', component: require('./components/main/sysCurrency') },
         { path: 'sysCapitalAccount', component: require('./components/main/sysCapitalAccount') },
      ]},
      {path: '*', redirect: '/login'}
   ];
   return route;
}
module.exports = configRouter;