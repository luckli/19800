<template>
   <div id="content" class="content">
      <h1 class="page-header">人民币提现记录列表 <small>人民币提现记录维护</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">人民币提现记录列表</h4></div>
               <div class="panel-body">
                  <div class="form-inline text-right">
                     
                     <div class="form-group">
                        <input type="text" class="form-control input-sm" v-model="search.queryText" @keyup.enter="getCnyCashList()" placeholder="输入email或姓名进行搜索..." />
                     </div>
                     <div class="input-daterange input-group group-date" id="datepicker">
                        <input type="text" class="input-sm form-control date-range" v-model="search.beginDate" @change="getCnyCashList()" readonly />
                        <span class="input-group-addon">to</span>
                        <input type="text" class="input-sm form-control date-range" v-model="search.endDate" @change="getCnyCashList()" readonly />
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
                           <td>{{item.Id}}</td>
                           <td>{{item.UserName}}</td>
                           <td>{{item.Email}}</td>
                           <td>{{item.Amount}}</td>
                           <td>{{item.TxAmount}}</td>
                           <td>{{item.Fee}}</td>
                           <td>{{item.TxFee}}</td>
                           <td>{{item.Address}}</td>
                           <td><span v-if="1 == item.Status">未处理</span>
                              <span v-if="2 == item.Status">验证失败</span>
                              <span v-if="3 == item.Status">等待审核</span>
                              <span v-if="4 == item.Status">处理中</span>
                              <span v-if="5 == item.Status">完成</span>
                              <span v-if="6 == item.Status">处理失败</span>
                              <span v-if="7 == item.Status">取消</span>
                           </td>
                           <td>{{item.CreatedAt}}</td>
                           <td>{{item.CreatedAt}}</td>
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
      },
      methods:{
         // 获取人民币提现记录列表
         getCnyCashList: function(){
            var vm = this;
         }
      },
      replace: true
   }
</script>