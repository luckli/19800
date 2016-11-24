<template>
   <div class="loginModule">
      <!-- <div id="page-loader" class="fade in"><span class="spinner"></span></div> -->
      <div id="page-container" class="">
         <!-- begin loginfade-->
        <div class="login bg-black animated fadeInDown">
            <!-- begin brand -->
            <div class="login-header">
               <div class="brand">
                 <span class="logo"></span>OA
                 <small>欢迎进入资望OA管理后台</small>
               </div>
               <div class="icon">
                 <i class="fa fa-sign-in"></i>
               </div>
            </div>
            <!-- end brand -->
            <div class="login-content">
               <form method="POST" class="margin-bottom-0">
                  <div class="form-group m-b-20">
                     <input type="text" class="form-control input-lg" name="name" placeholder="用户名" />
                  </div>
                  <div class="form-group m-b-20">
                     <input type="password" class="form-control input-lg" name="pwd" placeholder="登陆密码" />
                  </div>
                  <div class="form-group m-b-20">
                     <input type="text" class="form-control input-lg" name="otp" placeholder="谷歌身份验证码" />
                  </div>
                  <div class="login-buttons">
                     <button type="submit" class="btn btn-success btn-block btn-lg" @click="login()">登陆</button>
                  </div>
               </form>
            </div>
        </div>
        <!-- end login -->
      </div>
   </div>

</template>
<script>
   export default {
      name: 'login',
      mounted(){
         console.log('login');
         Pace.stop();
      },
      methods: {
         login: function(e){
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();

            var _self = this;

            _self.$router.push('/main');
         }
      },
      replace:true
   }
</script>