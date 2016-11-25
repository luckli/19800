
function configRouter(){
   var route = [
      //{path: '/', component: {template: '<router-view></router-view>'}},
      {path: '/login', name: 'login', component: require('./components/login')},
      {path: '/main', name: 'main', component: require('./components/main'),children: [
         { path: 'adminList', component: require('./components/main/adminList') },
         { path: 'financialList', component: require('./components/main/financialList') },
      ]},
      {path: '*', redirect: '/login'}
   ];
   return route;
}
module.exports = configRouter;