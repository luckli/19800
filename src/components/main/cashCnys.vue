<template>
   <div id="content" class="content">
      <h1 class="page-header">人民币提现记录列表 <small>人民币提现记录维护</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">人民币提现记录列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-4 col-md-4 manage-btns">
                     <button class="btn btn-inverse" data-id="coin-dismiss">驳回</button>
                  </div>
                  <div class="col-xs-8 col-md-8 form-inline text-right">
                     <div class="form-group">
                        <input type="text" class="form-control input-sm" v-model="search.queryText" @keyup.enter="getCnyCashList()" placeholder="输入email或姓名进行搜索..." />
                     </div>
                     <div class="input-daterange input-group group-date" id="datepicker">
                        <input type="text" class="input-sm form-control date-range" placeholder="开始时间" v-model="search.beginDate" @change="getCnyCashList()" readonly />
                        <span class="input-group-addon">to</span>
                        <input type="text" class="input-sm form-control date-range" placeholder="结束时间" v-model="search.endDate" @change="getCnyCashList()" readonly />
                     </div>
                     <div class="form-group radio-status">
                        <label v-for="state in statusList"><input type="radio" name="status" :value="state.id" v-model="search.status" @change="getCnyCashList()" /><span>{{state.val}}</span></label>
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="cashCnyList-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>用户</th>
                           <th>提现银行</th>
                           <th>金额</th>
                           <th>手续费</th>
                           <th>打款金额</th>
                           <th>转账费</th>
                           <th>转出账号</th>
                           <th>状态</th>
                           <th>创建日期</th>
                           <th>完成日期</th>
                           <th>操作人</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.UserName}}</td>
                           <td>{{item.BankName}}</td>
                           <td>{{item.Amount}}</td>
                           <td>{{item.Fee}}</td>
                           <td>{{item.PayAmount}}</td>
                           <td>{{item.TxFee}}</td>
                           <td>{{item.CapitalAccountNumber}}</td>
                           <td><span v-if="1 == item.Status">未处理</span>
                              <span v-if="2 == item.Status">验证失败</span>
                              <span v-if="3 == item.Status">等待审核</span>
                              <span v-if="4 == item.Status">处理中</span>
                              <span v-if="5 == item.Status">完成</span>
                              <span v-if="6 == item.Status">处理失败</span>
                              <span v-if="7 == item.Status">取消</span>
                           </td>
                           <td>{{item.CreatedAt}}</td>
                           <td>{{item.UpdateAt}}</td>
                           <td>{{item.OperatorName}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="11" style="text-align: center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 驳回 -->
      <div class="modal fade" id="mod-dismiss">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确定驳回该记录吗？</h4>
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
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toDismiss()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 驳回 -->
   </div>
</template>
<script>
   import '../../assets/lib/datepicker'
   import '../../assets/lib/bootstrap-datepicker'
   import Custom from 'custom'
   export default{
      name: 'cashCnyList',
      data(){
         return{
            items: [],
            item: -1,
            reason: '',
            search: {queryText: '',status: 1,beginDate: '',endDate: '',pageIndex: 1,pageSize: 10},
            statusList: [{id: 1,val: '待审计'},{id: 2,val: '待分配'},{id: 3,val: '待处理'},{id: 4,val: '已完成'},{id: 5,val: '已取消'},{id: 6,val: '审计失败'}]
         }
      },
      mounted(){
         var vm = this;

         vm.getCnyCashList();

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
            vm.getCnyCashList();
         });

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info="请选择一个已完成的记录",index = -1;
            if('coin-dismiss' == _id){
               for(var i = 0;i<vm.items.length;i++){
                  if(vm.item == vm.items[i].Id && (5==vm.items[i].Status)){
                     vm.item = vm.items[i].Id;
                     index = 1;
                  }
               }
               if(Custom.isSelected({title: title,txt: info,index: index})){
                  $('#mod-dismiss').modal('show');
               }
            }
         });

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            vm.reason = '';
         });
         Custom.selectItem('#cashCnyList-table',vm.item,function(res){
            vm.item = res;
         });
      },
      methods:{
         // 驳回
         toDismiss: function(){
            var vm = this;

            Custom.ajaxFn('/Withdraw/Rollback',{
               data: {withrawId: vm.item,reason: vm.reason},
               callback: function(res){
                  if(res.IsSuccess){
                  }else{
                     Custom.isSelected({title: title,txt: '驳回失败，'+res.ErrorMsg,index: -1});
                  }
                  $('#mod-dismiss').modal('hide');
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取人民币提现记录列表
         getCnyCashList: function(){
            var vm = this;

            Custom.ajaxFn('/Withdraw/GetList',{
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;

                     for(var i =0;i<list.length;i++){
                        list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                        list[i].UpdateAt = Custom.dateTimeFormatter(list[i].UpdateAt);
                     }
                     vm.items = list;
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