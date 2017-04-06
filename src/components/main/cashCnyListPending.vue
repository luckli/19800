<template>
   <div id="content" class="content">
      <h1 class="page-header">待处理人民币提现列表 <small>人民币提现记录维护</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">待处理人民币提现列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-4 col-md-4 manage-btns">
                     <button class="btn btn-inverse" data-id="coin-cplCash" v-if="3==search.status">完成提现</button>
                     <button class="btn btn-inverse" data-id="coin-cnlCash" v-if="3==search.status">取消提现</button>
                     <button class="btn btn-info" data-id="coin-CMBC"><i class="fa fa-file-excel-o"></i>招商</button>
                     <button class="btn btn-info" data-id="coin-SPBD"><i class="fa fa-file-excel-o"></i>浦发</button>
                  </div>
                  <div class="col-xs-8 col-md-8 form-inline text-right">
                     
                     <div class="form-group">
                        <input type="text" class="form-control input-sm" v-model="search.queryText" @keyup.enter="getCnyCashList()" placeholder="输入email或姓名进行搜索..." />
                     </div>
                     <div class="input-daterange input-group group-date" id="datepicker">
                        <input type="text" class="input-sm form-control date-range" placeholder="开始时间" readonly />
                        <span class="input-group-addon">to</span>
                        <input type="text" class="input-sm form-control date-range" placeholder="结束时间" readonly />
                     </div>
                     <div class="form-group radio-status">
                        <label><input type="radio" name="status" value="3" v-model="search.status" @change="getCnyCashList()" /><span>待处理</span></label>
                        <label><input type="radio" name="status" value="5" v-model="search.status" @change="getCnyCashList()" /><span>已完成</span></label>
                        <label><input type="radio" name="status" value="6" v-model="search.status" @change="getCnyCashList()" /><span>已取消</span></label>
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="cashCnyPending-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>用户</th>
                           <th>提现银行</th>
                           <th>应付金额</th>
                           <th>转出账号</th>
                           <th>状态</th>
                           <th>创建日期</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>ID: {{item.Id}}<br />{{item.UserName}}<br /><button class="btn btn-info btn-xs ex-reset" @click.stop="toReset(item.Id)" v-if="item.Status"><i class="fa fa-undo"></i><span> 重置</span></button></td>
                           <td>银行：{{item.BankName}}<br />账号：{{item.AccountNumber}} <br />开户人：{{item.UserName}}</td>
                           <td>{{item.Amount}}</td>
                           <td>银行：{{item.CapitalBankName}}<br />账号：{{item.CapitalAccountNumber}} <br />开户人：{{item.CapitalUserName}}</td>
                           <td><span v-if="1 == item.Status">未处理</span>
                              <span v-if="2 == item.Status">验证失败</span>
                              <span v-if="3 == item.Status">等待审核</span>
                              <span v-if="4 == item.Status">处理中</span>
                              <span v-if="5 == item.Status">完成</span>
                              <span v-if="6 == item.Status">处理失败</span>
                              <span v-if="7 == item.Status">取消</span>
                           </td>
                           <td>{{item.CreatedAt}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="11" style="text-align: center;">无数据</td>
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
      <!-- 完成提现 -->
      <div class="modal fade" id="mod-cplCash">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">完成提现</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">提现Id</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="item" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">资金来源ID<span>*</span></label>
                        <div class="col-md-6">
                           <select v-model="cashObj.capitalAccountId" class="form-control">
                              <option v-for="bank in banks" :value="bank.Id">{{bank.AccountNumber}}</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">手续费<span>*</span></label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" v-model="cashObj.txFee" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toCash()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 完成提现 -->

      <!-- 取消提现 -->
      <div class="modal fade" id="mod-cnlCash">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">取消提现</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">账号</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="item" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">取消原因</label>
                        <div class="col-md-6">
                           <textarea class="form-control" v-model="reason"></textarea>
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toCancel()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 取消提现 -->
   </div>
</template>
<script>
   import '../../assets/lib/datepicker'
   import '../../assets/lib/bootstrap-datepicker'
   import Custom from 'custom'
   import Page from 'page'
   export default{
      name: 'cashCnyListPending',
      data(){
         return{
            items: [],
            item: -1,
            banks: [],
            total: 0,
            totalItems: 0,
            sign: 6,
            accountType: '',
            reason: '',
            totalItems: 0,
            total: 0,
            search: {queryText: '',beginDate: '',endDate: '',status: 3,pageIndex: 1,pageSize: 10},
            cashObj:{withrawId: -1,capitalAccountId: -1,txFee: 0}
         }
      },
      mounted(){
         var vm = this;

         vm.getCnyCashList();

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            vm.cashObj = {withrawId: -1,capitalAccountId: vm.banks[0].Id,txFee: 0};
            vm.reason = '';
         });

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
            //vm.getCnyCashList();
         });

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个待处理记录";
            if('coin-cplCash' == _id){
               if(vm.IsSelected(title,info)){
                  if(0 == vm.banks.length){
                     vm.getCapitalAccount();
                  }
                  $('#mod-cplCash').modal('show');
               }
            }else if('coin-cnlCash' == _id){
               if(vm.IsSelected(title,info)){
                  $('#mod-cnlCash').modal('show');
               }
            }else if('coin-CMBC' == _id){
               vm.accountType = 6;
               vm.exportCashList();
            }else if('coin-SPBD' == _id){
               vm.accountType = 9;
               vm.exportCashList();
            }
         });

         Custom.selectItem('#cashCnyPending-table',vm.item,function(res){
            vm.item = res;
            for(var i = 0;i<vm.items.length;i++){
               if(res == vm.items[i].Id){
                  vm.cashObj.withrawId = vm.items[i].Id;
                  vm.cashObj.capitalAccountId = vm.items[i].CapitalAccountNumber;
                  vm.cashObj.capitalAccountId = vm.items[i].CapitalAccountNumber;
               }
            }
         });
      },
      watch: {
         'search.beginDate'(cur,old){
            this.getCnyCashList();
         },
         'search.endDate'(cur,old){
            this.getCnyCashList();
         }
      },
      methods:{
         // 导出提现列表
         exportCashList: function(){
            var vm = this;
            var url = Custom.ip+'/Withdraw/Export/?status='+vm.search.status+'&accountType='+vm.accountType+'&queryText='+vm.search.queryText+
               '&beginDate='+vm.search.beginDate+'&endDate='+vm.search.endDate;
            window.open(url);
            /*Custom.ajaxFn('/Withdraw/Export',{
               data: {status: vm.search.status,accountType: vm.accountType,queryText: vm.search.queryText,beginDate: vm.search.beginDate,endDate: vm.search.endDate},
               method: 'GET',
               dataType: 'application/vnd.ms-excel',
               callback: function(res){
                  console.log(res);
                  if(res.IsSuccess){
                     /*var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                     }*/
                  /*}
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });*/
         },
         // 完成提现
         toCash: function(){
            var vm = this;

            Custom.ajaxFn('/Withdraw/Complete',{
               data: vm.cashObj,
               vm: vm,
               callback: function(res){
                  var msg = '提现成功！';
                  if(res.IsSuccess){
                     vm.getCnyCashList();
                     $('#mod-cplCash').modal('hide');
                  }else{
                     msg = '提现失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 取消提现
         toCancel: function(){
            var vm = this;

            Custom.ajaxFn('/Withdraw/RollBack',{
               data: {withrawId: vm.item,reason: vm.reason},
               callback: function(res){
                  var msg = '取消成功！';
                  if(res.IsSuccess){
                     vm.getCnyCashList();
                     $('#mod-cnlCash').modal('hide');
                  }else{
                     msg = '取消失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 重置提现
         toReset: function(id){
            var vm = this;

            Custom.ajaxFn('/Withdraw/Reset',{
               data: {withrawId: id},
               callback: function(res){
                  var msg = '重置成功！';
                  if(res.IsSuccess){
                     vm.getCnyCashList();
                  }else{
                     msg = '重置失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 待处理cny提现列表
         getCnyCashList: function(){
            var vm = this;

            if((vm.search.beginDate && ''!=vm.search.beginDate) &&(vm.search.endDate && ''!=vm.search.endDate)){
               Custom.ajaxFn('/Withdraw/GetMyList',{
                  data: vm.search,
                  callback: function(res){
                     if(res.IsSuccess){
                        var list = res.Data.Items;
                        for(var i = 0;i<list.length;i++){
                           list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                        }
                        vm.items = list;

                        vm.total = res.Data.TotalPage;
                        vm.search.pageIndex = res.Data.CurrentPage;
                        vm.totalItems = res.Data.TotalItems;
                     }else{
                        Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                     }
                  },
                  errorCallback: function(res){
                     Custom.isSelected({title: '提示',txt: '获取失败！',index: -1});
                  }
               });
            }
         },
         // 获取资金账号列表
         getCapitalAccount: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/List',{
               callback: function(res){
                  if(res.IsSuccess){
                     vm.banks = res.Data;
                     vm.cashObj.capitalAccountId = vm.banks[0].Id;
                  }
               },
               errorCallback: function(res){
                  vm.banks = [];
                  Custom.isSelected({title: '提示',txt: '获取失败，'+res.statusText,index: -1});
               }
            });
         },
         pageFn: function(index){
            var vm = this;
            vm.search.pageIndex = index;
            vm.getCnyCashList();
         },
         // 请选择一个管理员
         IsSelected: function(title,txt){
            var vm = this;
            
            return Custom.isSelected({title: title,txt: txt,index: vm.item});
         }
      },
      components:{
         Page
      },
      replace: true
   }
</script>