
function configRouter(){
   var route = [
      //{path: '/', component: {template: '<router-view></router-view>'}},
      {path: '/login', name: 'login', component: require('./components/login')},
      {path: '/main', name: 'main', component: require('./components/main'),children: [
         { path: 'moduleAdmin', component: require('./components/main/moduleAdmin') },
         { path: 'moduleFinancial', component: require('./components/main/moduleFinancial') },
         { path: 'moduleManage', component: require('./components/main/moduleManage') },
         { path: 'moduleAuth/:Id', name: 'moduleAuth', component: require('./components/main/moduleAuth') },
         { path: 'moduleRole', component: require('./components/main/moduleRole') },
         { path: 'moduleRoleAuth/:Id', name: 'moduleRoleAuth', component: require('./components/main/moduleRoleAuth') }
      ]},
      {path: '*', redirect: '/login'}
   ];
   return route;
}
module.exports = configRouter;