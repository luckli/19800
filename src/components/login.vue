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
               <form method="POST" class="margin-bottom-0" @keydown.enter="login()">
                  <div class="form-group m-b-20">
                     <input type="text" class="form-control input-lg" v-model="account" name="name" placeholder="用户名" />
                     <div class="msg" :class="{'on': validate.name}">用户名不能为空</div>
                  </div>
                  <div class="form-group m-b-20">
                     <input type="password" class="form-control input-lg" v-model="password" name="pwd" placeholder="登陆密码" />
                     <div class="msg" :class="{'on': validate.pwd}">密码不能为空</div>
                  </div>
                  <div class="form-group m-b-20">
                     <input type="text" class="form-control input-lg" name="otp" v-model="otpCode" placeholder="谷歌身份验证码" />
                  </div>
                  <div class="login-buttons">
                     <button type="submit" class="btn btn-success btn-block btn-lg" @click="login()" :disabled="sign.isLock">{{sign.txt}}</button>
                  </div>
               </form>
            </div>
        </div>
        <!-- end login -->
      </div>
   </div>

</template>
<script>
    import Custom from 'custom'
    export default {
      name: 'login',
      data(){
         return {
            account: null,
            password: null,
            otpCode: '',
            sign:{txt: '登陆',isLock: false}
         }
      },
      computed: {
         validate: function(){
            var vm = this,name = false,pwd=false;
            if('string' === typeof vm.account){
               name = !vm.account.trim();
            }
            if('string' === typeof vm.password){
               pwd = !vm.password.trim();
            }
            return {
               name: name,
               pwd: pwd
            }
         }
      },
      mounted(){
         Pace.stop();
      },
      methods: {
         login: function(e){
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();

            var vm = this;
            
            vm.sign.txt = '登陆中...';
            vm.sign.isLock = true;
            if(vm.sign.isLock){
               Custom.ajaxFn('/Home/Login',{
                  data: {account: vm.account,password: vm.password,otpCode: vm.otpCode},
                  callback: function(res){
                     var msg = '';
                     if(res.IsSuccess){
                        vm.$router.push('/main');
                     }else{
                        if(res.Code == 2){msg = '账号不存在';
                        }else if(res.Code == 4){msg = '密码错误';
                        }else if(res.Code == 8){msg = '谷歌身份验证失败';
                        }else if(res.Code == 16){msg = '账号被锁定';
                        }else if(res.Code == 32){msg = '密码错误次数超过5次，半小时再登录';}
                        Custom.isSelected({title:'提示',txt: msg,index: -1});
                        vm.sign.txt = '登陆';
                        vm.sign.isLock = false;
                     }
                  },
                  errorCallback: function(res){
                     vm.sign.txt = '登陆';
                     vm.sign.isLock = false;
                  }
               });
            }
         }
      },
      replace:true
    }
</script>