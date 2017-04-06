<template>
   <div id="content" class="content">
      <h1 class="page-header">虚拟币充值列表 <small>虚拟币充值查询</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">虚拟币充值列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-4 col-md-4 manage-btns">
                     <button class="btn btn-inverse" data-id="coin-recharge">确认充值</button>
                     <button class="btn btn-inverse" data-id="coin-revoke">撤销充值</button>
                  </div>
                  <form class="col-xs-8 col-md-8 form-inline text-right">
                     <div class="form-group">
                        <label for="">币种</label>
                        <select v-model="search.currencyId" class="form-control input-sm" @change="getCoinDepositList()">
                           <option v-for="type in CTypeList" :value="type">{{type}}</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <input type="text" class="form-control input-sm" v-model="search.queryText" @keyup.enter="getCoinDepositList()" placeholder="输入email进行搜索..." />
                     </div>
                     <div class="input-daterange input-group group-date" id="datepicker">
                        <input type="text" class="input-sm form-control date-range" placeholder="开始时间" v-model="search.beginDate" @change="getCoinDepositList()" readonly />
                        <span class="input-group-addon">to</span>
                        <input type="text" class="input-sm form-control date-range" placeholder="结束时间" v-model="search.endDate" @change="getCoinDepositList()" readonly />
                     </div>
                     <div class="form-group radio-status">
                        <label><input type="radio" name="status" value="1" v-model="search.status" @change="getCoinDepositList()" /><span>待确认</span></label>
                        <label><input type="radio" name="status" value="2" v-model="search.status" @change="getCoinDepositList()" /><span>已完成</span></label>
                        <label><input type="radio" name="status" value="3" v-model="search.status" @change="getCoinDepositList()" /><span>已失效</span></label>
                     </div>
                  </form>
                  <div class="clearfix"></div>
                  <table id="coin-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>充值ID</th>
                           <th>充值地址</th>
                           <th>充值金额</th>
                           <th>Fee</th>
                           <th>TexFee</th>
                           <th>TxNo</th>
                           <th>确认次数</th>
                           <th>状态</th>
                           <th>创建日期</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.Id}}</td>
                           <td>{{item.Address}}</td>
                           <td>{{item.Volume}}</td>
                           <td>{{item.Fee}} %</td>
                           <td>{{item.TexFee}}</td>
                           <td>{{item.TxNo}}</td>
                           <td>{{item.Confirmation}}</td>
                           <td>{{item.CoinDepositStatus}}</td>
                           <td>{{item.CreatedAt}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="9" style="text-align:center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 确认/撤销充值 -->
      <div class="modal fade" id="mod-rcg">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-if="1==sign">确认充值</span><span v-if="2==sign">撤销充值</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">账号</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="item" readonly />
                        </div>
                     </div>
                     <div class="form-group" v-if="2==sign">
                        <label class="col-md-4 control-label custom-label">取消原因</label>
                        <div class="col-md-6">
                           <textarea class="form-control" v-model="reason"></textarea>
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-if="1==sign" @click="toSubmit()">确定</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-if="2==sign" @click="toCancel()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 确认/撤销充值 -->
   </div>
</template>
<script>
   import '../../assets/lib/datepicker'
   import '../../assets/lib/bootstrap-datepicker'
   import Custom from 'custom'
   export default{
      name: 'cashCny',
      data(){
         return{
            items: [],
            item: -1,
            sign: 1,
            CTypeList: [],
            reason: '',
            search: {queryText: '',currencyId: 0,status: 1,beginDate: '',endDate: '',pageIndex: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         vm.getCurrencyTypeList();

         $('.group-date').datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd'
         }).on('changeDate',function(ev){
            var count = 0;
            $('.group-date input').each(function(){
               if(count == 0){
                  vm.search.beginDate = $(this).val();
               }else if(count == 1){
                  vm.search.endDate = $(this).val();
               }
               count ++;
            });
            vm.getCoinDepositList();
         });
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个充值记录";
            if('coin-recharge' == _id){
               if(vm.IsSelected(title,info)){
                  vm.sign = 1;
                  $('#mod-rcg').modal('show');
               }
            }else if('coin-revoke' == _id){
               if(vm.IsSelected(title,info)){
                  vm.sign = 2;
                  $('#mod-rcg').modal('show');
               }
            }
         });

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            vm.reason = '';
         });

         Custom.selectItem('#coin-table',vm.item,function(res){
            vm.item = res;
         });
      },
      methods:{
         // 确认充值
         toSubmit: function(){
            var vm = this;

            Custom.ajaxFn('/CoinDeposit/Confirm',{
               data: {depositId: vm.item},
               vm: vm,
               callback: function(res){
                  var msg = '充值成功！';
                  if(res.IsSuccess){
                     $('#mod-rcg').modal('hide');
                  }else{
                     msg = '充值失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 撤销充值
         toCancel: function(){
            var vm = this;

            Custom.ajaxFn('/CoinDeposit/Cancel',{
               data: {depositId: vm.item,reason: vm.reason},
               vm: vm,
               callback: function(res){
                  var msg = '撤销成功！';
                  if(res.IsSuccess){
                     $('#mod-rcg').modal('hide');
                  }else{
                     msg = '撤销失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取虚拟币充值列表
         getCoinDepositList: function(){
            var vm = this;

            Custom.ajaxFn('/CoinDeposit/GetList',{
               data: vm.search,
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data.Items;
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取币种列表
         getCurrencyTypeList: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/VirtualList',{
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.CTypeList = res.Data;
                     vm.search.currencyId = res.Data[0];
                     vm.getCoinDepositList();
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 请选择一个管理员
         IsSelected: function(title,txt){
            var vm = this;
            
            return Custom.isSelected({title: title,txt: txt,index: vm.item});
         }
      },
      replace: true
   }
</script>