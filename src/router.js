
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
         { path: 'rcgRechargeList', component: require('./components/main/rcgRechargeList') },
         { path: 'rcgCnyPending', component: require('./components/main/rcgCnyPending') },
         { path: 'sysCurrency', component: require('./components/main/sysCurrency') },
         { path: 'sysCapitalAccount', component: require('./components/main/sysCapitalAccount') },
      ]},
      {path: '*', redirect: '/login'}
   ];
   return route;
}
module.exports = configRouter;