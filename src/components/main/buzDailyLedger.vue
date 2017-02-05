<template>
   <div id="content" class="content">
      <h1 class="page-header">日账本列表 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">日账本列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="buz-addExtendTo">添加额外收支</button>
                  </div>
                  <div class="col-xs-4 col-md-4 search form-inline text-right">
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
                           <th>额外收支</th>
                           <th>期末余额</th>
                           <th>综合</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.Id}}</td>
                           <td>{{item.VipLevel}}</td>
                           <td>{{item.WithdrawRate}}</td>
                           <td>{{item.DepositRate}}</td>
                           <td>{{item.TradeRate}}</td>
                           <td>{{item.UpdatedAt}}</td>
                           <td>{{item.UpdatedAt}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="7" style="text-align: center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 添加额外收支 -->
      <div class="modal fade" id="mod-addExtendTo">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">添加额外收支</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">资金账号<span>*</span></label>
                        <div class="col-md-6">
                           <select class="form-control input-sm" v-model="obj.capitalAccountId">
                              <option v-for="bank in banks" :value="bank.Id">{{bank.AccountNumber}}</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">银行转账交易号<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="obj.withdrawRate" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">金额<span>*</span></label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" v-model="obj.amount" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">备注<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="obj.remark" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toAdd()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 添加额外收支 -->
   </div>
</template>
<script>
   import '../../assets/lib/datepicker'
   import '../../assets/lib/bootstrap-datepicker'
   import Custom from 'custom'
   export default {
      name: 'daily',
      data(){
         return {
            items: [],
            banks: [],
            obj: {capitalAccountId: 0,amount: '',remark: ''},
            search: {page: 1,pageSize: 10,period: ''}
         }
      },
      mounted(){
         var vm = this;

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id');
            if('buz-addExtendTo' == _id){
               if(0==vm.banks.length){
                  vm.getCapitalAccount();
               }
               $('#mod-addExtendTo').modal('show');
            }
         });

         
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
         vm.search.period = date.getFullYear() +'-'+(date.getMonth()+1) +'-'+date.getDate();
         vm.getPageList();
      },
      methods: {
         // 添加额外收支
         toAdd: function(){
            var vm = this;

            Custom.ajaxFn('/',{
               data: vm.obj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: '添加失败，'+res.statusText,index: -1});
                  }
                  $('#mod-addExtendTo').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '查看失败，'+res.statusText,index: -1});
               }
            });
         },
         // 获取收支列表
         getPageList: function(){
            var vm = this;

            Custom.ajaxFn('/Statistics/GetDailyList',{
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data.Items;
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
         }
      },
      replace: true
   }
</script>