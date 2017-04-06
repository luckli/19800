<template>
   <div id="content" class="content">
      <h1 class="page-header">系统账目列表 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">系统账目列表</h4></div>
               <div class="panel-body">
                  <table id="vip-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>币种</th>
                           <th>系统总金额</th>
                           <th>利润</th>
                           <th>账户总金额</th>
                           <th>日期</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.CurrencyId}}</td>
                           <td>{{item.TotalAmount}}</td>
                           <td>{{item.IncomeAmount}}</td>
                           <td>{{item.LedgerAmount}}</td>
                           <td>{{item.Period}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="7" style="text-align: center;">无数据</td>
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
      name: 'sysLedger',
      data(){
         return {
            items: [],
            banks: [],
            totalItems: 0,
            total: 0,
            obj: {capitalAccountId: 0,amount: '',remark: ''},
            search: {pageIndex: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         vm.getPageList();
      },
      methods: {
         // 获取收支列表
         getPageList: function(){
            var vm = this;

            Custom.ajaxFn('/Statistics/GetLedgerList',{
               data: vm.search,
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;

                     for(var i = 0;i<list.length;i++){
                        list[i].Period = Custom.dateTimeFormatter(list[i].Period);
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