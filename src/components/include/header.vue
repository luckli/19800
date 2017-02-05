<template>
   <div id="header" class="header navbar navbar-default navbar-fixed-top">
      <!-- begin container-fluid -->
      <div class="container-fluid">
         <!-- begin mobile sidebar expand / collapse button -->
         <div class="navbar-header">
            <a href="index.html" class="navbar-brand"><span class="navbar-logo"></span> Color Admin</a>
            <button type="button" class="navbar-toggle" data-click="sidebar-toggled">
               <span class="icon-bar"></span>
               <span class="icon-bar"></span>
               <span class="icon-bar"></span>
            </button>
         </div>
         <!-- end mobile sidebar expand / collapse button -->
         
         <!-- begin header navigation right -->
         <ul class="nav navbar-nav navbar-right">
            <li class="dropdown navbar-user">
               <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                  <img src="../../assets/img/user-13.jpg" alt="" /> 
                  <span class="hidden-xs">admin</span> <b class="caret"></b>
               </a>
               <ul class="dropdown-menu animated fadeInLeft">
                  <li class="arrow"></li>
                  <li><a href="javascript:;">修改登录密码</a></li>
                  <li class="divider"></li>
                  <li><a href="javascript:;" @click="logout()">退出登录</a></li>
               </ul>
            </li>
         </ul>
         <!-- end header navigation right -->
      </div>
      <!-- end container-fluid -->
   </div>
</template>
<script>
   import Custom from 'custom'
   export default{
      name: 'header',
      mounted(){

      },
      methods: {
         logout: function(){
            var vm = this;

            Custom.ajaxFn('/Home/LoginOut',{
               callback: function(res){
                  vm.$router.push('/login');
                  /*if(res.IsSuccess){
                  }else{
                     Custom.isSelected({title: '提示',txt: '登出失败，'+res.errorMsg,index: -1});
                  }*/
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败，'+res.statusText,index: -1});
               }
            });
         }
      },
      replace: true
   }
</script>