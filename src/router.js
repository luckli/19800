
function configRouter(){
   var route = [
      //{path: '/', component: {template: '<router-view></router-view>'}},
      {path: '/login', name: 'login', component: require('./components/login')},
      {path: '/main', name: 'main', component: require('./components/main'),children: [
         { path: 'adminList', component: require('./components/main/adminList'),alias: '/adminList' },
      ]},
      {path: '*', redirect: '/login'}
   ];
   return route;
}
module.exports = configRouter;