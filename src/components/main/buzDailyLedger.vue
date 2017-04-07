<template>
   <div id="content" class="content">
      <h1 class="page-header">日账本列表 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">日账本列表</h4></div>
               <div class="panel-body">
                  <div class="search form-inline pull-right">
                     <div class="form-group input-date">
                        <label>日期</label>
                        <input type="text" class="form-control" id="period" placeholder="请输入日期" v-model="search.period" readonly />
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="vip-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>币种</th>
                           <th>期初余额</th>
                           <th>充值</th>
                           <th>提现</th>
                           <th>交易手续费</th>
                           <th>投资理财</th>
                           <th>硬性支出</th>
                           <th>期末余额</th>
                           <th>日期</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.CurrencyId}}</td>
                           <td>{{item.BeginBalance}}</td>
                           <td>
                              <span class="bold">已充值：</span>{{item.Deposit}}<br />
                              <span class="bold">充值中：</span>{{item.Depositing}}<br />
                              <span class="bold">手续费：</span>{{item.DepositFee}}<br />
                              <span class="bold">第三方手续费：</span>{{item.DepositTxFee}}<br />
                              <span class="bold">总手续费：</span>{{item.DepositingFee}}
                           </td>
                           <td>
                              <span class="bold">已提现：</span>{{item.Withdraw}}<br />
                              <span class="bold">提现中：</span>{{item.Withdrawing}}<br />
                              <span class="bold">手续费：</span>{{item.WithdrawFee}}<br />
                              <span class="bold">第三方手续费：</span>{{item.WithdrawTxFee}}<br />
                              <span class="bold">总手续费：</span>{{item.WithdrawingFee}}
                           </td>
                           <td>{{item.TradeFee}}</td>
                           <td>{{item.TransferInvest}}</td>
                           <td>{{item.TransferHard}}</td>
                           <td>{{item.EndBalance}}</td>
                           <td>{{item.Period}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="9" style="text-align: center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
                  <div>
                     <label>显示第 <span>{{(search.pageIndex*search.pageSize)-9}}</span> 至 <span>{{search.pageIndex*search.pageSize}}</span> 项结果，共 <span>{{totalItems}}</span> 项</label>
                     <Page class="pull-right" :index="search.pageIndex" :size="search.pageSize" :total="total" :callbacks="pageFn"></Page>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<script>
   import '../../assets/lib/datepicker'
   import '../../assets/lib/bootstrap-datepicker'
   import Page from 'page'
   import Custom from 'custom'
   export default {
      name: 'sysDaily',
      data(){
         return {
            items: [],
            banks: [],
            totalItems: 0,
            total: 0,
            obj: {capitalAccountId: 0,amount: '',remark: ''},
            search: {pageIndex: 1,pageSize: 10,period: ''},
         }
      },
      mounted(){
         var vm = this;
         
         $('#period').datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd',
            todayHighlight: true,
            initialDate: new Date()
         }).on('changeDate',function(ev){
            vm.search.period = $(this).val();
            vm.getPageList();
            /*$('.input-date input').each(function(){
               vm.search.period = $(this).val();
               vm.getPageList();
            });*/
         });

         var date = new Date();
         var month = date.getMonth()+1,
            day = date.getDate();
         if(month<=9){
            month = '0'+month;
         }
         if(day<=9){
            day = '0'+day;
         }
         vm.search.period = date.getFullYear() +'-'+ month +'-'+ day;
         vm.getPageList();
      },
      methods: {
         // 获取收支列表
         getPageList: function(){
            var vm = this;

            Custom.ajaxFn('/Statistics/GetDailyList',{
               data: vm.search,
               vm:vm,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items,date;
                     for(var i = 0;i<list.length;i++){
                        list[i].Period = list[i].Period.replace(/\//g, '-');
                     }
                     vm.items = list;

                     vm.total = res.Data.TotalPage;
                     vm.search.pageIndex = res.Data.CurrentPage;
                     vm.search.pageSize = res.Data.PageSize;
                     vm.totalItems = res.Data.TotalItems;
                  }else{
                     Custom.isSelected({title: '提示',txt: '收支列表展示失败，'+res.statusText,index: -1});
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '查看失败，'+res.statusText,index: -1});
               }
            });
         },
         // 获取资金账号列表
         getCapitalAccount: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/List',{
               vm:vm,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.banks = res.Data;
                     vm.obj.capitalAccountId = vm.banks[0].Id;
                  }
               },
               errorCallback: function(res){
                  vm.banks = [];
                  Custom.isSelected({title: '提示',txt: '查看失败，'+res.statusText,index: -1});
               }
            });
         },
         // 分页
         pageFn: function(index){
            var vm = this;
            vm.search.pageIndex = index;
            vm.getPageList();
         }
      },
      components:{
         Page
      },
      replace: true
   }
</script>