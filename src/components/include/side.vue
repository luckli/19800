<template>
   <div id="sidebar" class="sidebar">
      <!-- begin sidebar scrollbar -->
      <div data-scrollbar="true" data-height="100%">
         <!-- begin sidebar user -->
         <ul class="nav">
            <li class="nav-profile">
               <div class="image">
                  <a href="javascript:;"><img src="../../assets/img/user-13.jpg" alt="" /></a>
               </div>
               <div class="info">admin<small>欢迎进入管理后台</small>
               </div>
            </li>
         </ul>
         <!-- end sidebar user -->
         <!-- begin sidebar nav -->
         <ul class="nav">
            <li class="has-sub">
               <a href="javascript:;">
                   <b class="caret pull-right"></b>
                   <i class="fa fa-2x fa-group"></i>
                   <span>用户系统</span>
                </a>
               <ul class="sub-menu">
                   <li><router-link to="/main/moduleAdmin">管理员列表</router-link></li>
                   <li><router-link to="/main/moduleFinancial">财务列表</router-link></li>
                   <li><a href="javascript:;">用户列表</a></li>
                   <li><a href="javascript:;">用户列表(客)</a></li>
                   <li><a href="javascript:;">分红币发放记录</a></li>
                   <li><router-link to="/main/moduleManage">模块管理</router-link></li>
                   <li><router-link to="/main/moduleRole">角色管理</router-link></li>
               </ul>
            </li>
              <!-- begin sidebar minify button -->
            <li><a href="javascript:;" class="sidebar-minify-btn" data-click="sidebar-minify"><i class="fa fa-angle-double-left"></i></a></li>
              <!-- end sidebar minify button -->
         </ul>
         <!-- end sidebar nav -->
      </div>
      <!-- end sidebar scrollbar -->
   </div>
</template>
<script>
   import '../../../static/lib/jquery-1.9.1.min';
   import '../../../static/lib/jquery-migrate-1.1.0.min'
   import '../../../static/lib/jquery-ui.min'
   import '../../../static/lib/bootstrap/js/bootstrap.min'
   import '../../../static/lib/jquery.slimscroll'
   import '../../../static/lib/jquery.gritter.min'
   import App from '../../../static/lib/apps.min'
   export default {
      name: 'side',
      mounted(){
         var _self = this;
         _self.inits();
      },
      data () {
         return {
         }
      },
      methods: {
         inits: function(){
            $(document).ready(function() {
               App.init();
            });
         }
      },
      replace: true
   }
</script>