<template>
   <div id="content" class="content">
      <h1 class="page-header">虚拟币提现记录列表 <small>虚拟币提现记录维护</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">虚拟币提现记录列表</h4></div>
               <div class="panel-body">
                  <form class="form-inline text-right">
                     <div class="form-group">
                        <label for="">币种</label>
                        <select v-model="search.currencyId" class="form-control input-sm" @change="getCoinList()">
                           <option v-for="type in CTypeList" :value="type">{{type}}</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <input type="text" class="form-control input-sm" v-model="search.queryText" @input="getCoinList()" placeholder="输入email或userId进行搜索..." />
                     </div>
                     <div class="input-daterange input-group group-date" id="datepicker">
                        <input type="text" class="input-sm form-control date-range" placeholder="开始时间" readonly />
                        <span class="input-group-addon">to</span>
                        <input type="text" class="input-sm form-control date-range" placeholder="结束时间" readonly />
                     </div>
                     <div class="form-group radio-status">
                        <label v-for="state in statusList"><input type="radio" name="status" :value="state.id" v-model="search.status" @change="getCoinList()" /><span>{{state.val}}</span></label>
                     </div>
                  </form>
                  <div class="clearfix"></div>
                  <table id="cashCoin-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>ID</th>
                           <th>姓名</th>
                           <th>Email</th>
                           <th>请求金额</th>
                           <th>实际金额</th>
                           <th>手续费</th>
                           <th>第三方手续费</th>
                           <th>地址</th>
                           <th>状态</th>
                           <th>创建日期</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items">
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
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="10" style="text-align: center;">无数据</td>
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
   import Custom from 'custom'
   import Page from 'page'
   export default{
      name: 'coinCash',
      data(){
         return {
            items: [],
            CTypeList: [],
            total: 0,
            totalItems: 0,
            statusList: [{id: 0,val:'全部'},{id: 1,val:'初始状态'},{id: 2,val:'验证失败'},{id: 3,val:'等待审核'},{id: 4,val:'处理中'},{id: 5,val:'完成'},{id: 6,val:'处理失败'},{id: 7,val:'取消'}],
            search: {currencyId: '',status: 0,queryText: '',beginDate: '',endDate: '',pageIndex: 1,pageSize: 10}
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
            //vm.getCoinList();
         });
      },
      watch: {
         'search.beginDate'(cur,old){
            this.getCoinList();
         },
         'search.endDate'(cur,old){
            this.getCoinList();
         }
      },
      methods:{
         // 虚拟币提现列表
         getCoinList: function(){
            var vm = this;

            if((vm.search.beginDate && ''!=vm.search.beginDate) &&(vm.search.endDate && ''!=vm.search.endDate)){
               Custom.ajaxFn('/CoinWithdraw/GetList',{
                  data: vm.search,
                  vm: vm,
                  callback: function(res){
                     if(res.IsSuccess){
                        var list = res.Data.Items;
                        for(var i = 0;i<list.length;i++){
                           list[i].UpdatedAt = Custom.dateTimeFormatter(list[i].UpdatedAt);
                           list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                        }
                        vm.items = list;

                        vm.total = res.Data.TotalPage;
                        vm.search.pageIndex = res.Data.CurrentPage;
                        vm.totalItems = res.Data.TotalItems;
                     }
                  },
                  errorCallback: function(res){
                     Custom.isSelected({title: '提示',txt: '获取失败，'+res.statusText,index: -1});
                  }
               });
            }
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

                     vm.getCoinList();
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         pageFn: function(index){
            var vm = this;
            vm.search.pageIndex = index;
            vm.getCoinList();
         }
      },
      components:{
         Page
      },
      replace:true
   }
</script>