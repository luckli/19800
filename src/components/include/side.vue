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
                   <li><router-link to="/main/modAdmin">管理员列表</router-link></li>
                   <li><router-link to="/main/modFinancial">财务列表</router-link></li>
                   <li><router-link to="/main/modUser">用户列表</router-link></li>
                   <li><a href="javascript:;">分红币发放记录</a></li>
                   <li><router-link to="/main/modManage">模块管理</router-link></li>
                   <li><router-link to="/main/modRole">角色管理</router-link></li>
               </ul>
            </li>
            <li class="has-sub">
               <a href="javascript:;">
                   <b class="caret pull-right"></b>
                   <i class="fa fa-2x fa-fire"></i>
                   <span>运营管理</span>
                </a>
               <ul class="sub-menu">
                   <li><router-link to="/main/buzDailyLedger">日账本列表</router-link></li>
                   <li><router-link to="/main/buzAccount">账户列表</router-link></li>
                   <li><router-link to="/main/buzMarketDepth">市场深度</router-link></li>
                   <li><router-link to="/main/buzTradeVolume">成交量报表</router-link></li>
                   <li><router-link to="/main/buzTradeList">成交记录</router-link></li>
                   <li><router-link to="/main/buzExtraBudget">额外收支查询</router-link></li>
                   <li><router-link to="/main/buzSbDividends">赛波分红</router-link></li>
                   <li><router-link to="/main/buzLevel">realName等级管理</router-link></li>
                   <li><router-link to="/main/buzApply">realName申请列表</router-link></li>
                   <li><router-link to="/main/buzMsgSendList">短信发送列表</router-link></li>
                   <li><router-link to="/main/buzEmailSendList">邮件发送列表</router-link></li>
               </ul>
            </li>
            <li class="has-sub">
               <a href="javascript:;">
                   <b class="caret pull-right"></b>
                   <i class="fa fa-2x fa-money"></i>
                   <span>充值管理</span>
                </a>
               <ul class="sub-menu">
                   <li><router-link to="/main/rcgRechargeList">充值码列表</router-link></li>
                   <li><router-link to="/main/rcgCnyPending">Cny待确认充值</router-link></li>
                   <li><router-link to="/main/rcgCoinList">Coin充值列表</router-link></li>
               </ul>
            </li>
            <li class="has-sub">
               <a href="javascript:;">
                   <b class="caret pull-right"></b>
                   <i class="fa fa-2x fa-gift"></i>
                   <span>提现管理</span>
                </a>
               <ul class="sub-menu">
                   <li><router-link to="/main/cashCnyTask">人民币提现任务</router-link></li>
                   <li><router-link to="/main/cashCnyListPending">待处理人民币提现</router-link></li>
                   <li><router-link to="/main/cashCnyList">人民币提现列表(管)</router-link></li>
                   <li><router-link to="/main/cashCoinListPending">coin待审核提现列表</router-link></li>
                   <li><router-link to="/main/cashCoinList">coin提现列表</router-link></li>
               </ul>
            </li>
            <li class="has-sub">
               <a href="javascript:;">
                   <b class="caret pull-right"></b>
                   <i class="fa fa-2x fa-gift"></i>
                   <span>消息管理</span>
                </a>
               <ul class="sub-menu">
                   <li><router-link to="/main/msgTrigger">Notification触发器管理</router-link></li>
               </ul>
            </li>
            <li class="has-sub">
               <a href="javascript:;">
                   <b class="caret pull-right"></b>
                   <i class="fa fa-2x fa-group"></i>
                   <span>系统设置</span>
                </a>
               <ul class="sub-menu">
                   <li><router-link to="/main/sysCurrency">币种列表</router-link></li>
                   <li><router-link to="/main/sysCapitalAccount">资金账户列表</router-link></li>
                   <li><router-link to="/main/sysVipSetting">Vip设置</router-link></li>
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
  import '../../assets/lib/jquery-1.9.1.min'
   //import '../../../static/lib/jquery-1.9.1.min';
   import '../../assets/lib/jquery-migrate-1.1.0.min'
   import '../../assets/lib/jquery-ui.min'
   import '../../assets/lib/bootstrap/js/bootstrap.min'
   import '../../assets/lib/jquery.slimscroll'
   import '../../assets/lib/jquery.gritter.min'
   import App from '../../assets/lib/apps.min'
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