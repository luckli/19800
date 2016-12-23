import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Apps from './App'
import configRouter from './router'

Vue.use(VueRouter);
Vue.use(VueResource);

var router = new VueRouter({
   mode: 'hash',
   base: __dirname,
   routes: configRouter(router)
});
router.beforeEach(function(to,from,next){
   if('login' == to.name){
      $('.pace-done').removeClass();
      $('.pace.pace-inactive').remove();
   }
   setTimeout(function(){
      $('.sub-menu>li>a').each(function(){
         var url = $(this).attr('href'),
            path = to.path;
            url = url.substr(url.lastIndexOf('/')+1);
            path = path.substr(path.lastIndexOf('/')+1);
         if(path === url){
            $(this).parent().parent().css('display','block').parent().addClass('expand');
         }
      });
   },500);

   next(true);
});

new Vue({
  router,
  template: '<Apps/>',
  components: { Apps }
}).$mount('#app');
