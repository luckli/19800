<template>
   <div id="content" class="content">
      <h1 class="page-header">成交量报表 <small>成交量报表</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">成交量报表</h4></div>
               <div class="panel-body">
                  <form class="form-inline">
                     <div class="form-group">
                        <label>市场</label>
                        <select class="form-control input-sm" v-model="search.marketId" @change="getTradeList()">
                           <option v-for="market in markets" :value="market">{{market}}</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <label>天数频度</label>
                        <select class="form-control input-sm" v-model="search.frequency" @change="getTradeList()">
                           <option value="1">1天</option>
                           <option value="7">7天</option>
                           <option value="30">30天</option>
                        </select>
                     </div>
                     <div class="input-daterange input-group group-date" id="datepicker">
                        <input type="text" class="input-sm form-control date-range" placeholder="开始时间" readonly />
                        <span class="input-group-addon">to</span>
                        <input type="text" class="input-sm form-control date-range" placeholder="结束时间" readonly />
                     </div>
                  </form>
                  <table id="account-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>市场</th>
                           <th>交易金额</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items">
                           <td>{{item.Id}}</td>
                           <td>{{item.UserName}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="2" style="text-align:center;">无数据</td>
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
   export default {
      name: 'trade',
      data(){
         return{
            items: [],
            totalItems: 0,
            total: 0,
            search:{beginDate: '',endDate: '',pageIndex: 1,pageSize: 10,marketId: '',frequency: 1}
         }
      },
      mounted(){
         var vm = this;

         vm.getMarketList();

         $('.group-date').datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd'
         }).on('changeDate',function(ev){
            var count = 0;
            $('.group-date input').each(function(){
               if(count == 0){
                  vm.$set(vm.search,'beginDate',$(this).val());
               }else if(count == 1){
                  vm.$set(vm.search,'endDate',$(this).val());
               }
               count ++;
            });
            //vm.getTradeList();
         });
      },
      watch: {
         'search.beginDate'(cur,old){
            this.getTradeList();
         },
         'search.endDate'(cur,old){
            this.getTradeList();
         }
      },
      methods:{
         // 获取成交量报表
         getTradeList: function(){
            var vm = this;
            if((vm.search.beginDate && ''!=vm.search.beginDate) &&(vm.search.endDate && ''!=vm.search.endDate)){
               Custom.ajaxFn('/Market/GetTurnoverList',{
                  data: vm.search,
                  vm:vm,
                  callback: function(res){
                     if(res.IsSuccess){
                        vm.items = res.Data.Items;

                        //for()
                        vm.total = res.Data.TotalPage;
                        vm.search.pageIndex = res.Data.CurrentPage;
                        vm.totalItems = res.Data.TotalItems;
                     }else{
                        vm.items = [];
                        Custom.isSelected({title: '提示',txt: res.errorMsg,index: -1});
                     }
                  },
                  errorCallback: function(res){
                     Custom.isSelected({title: '提示',txt: '获取失败，'+res.statusText,index: -1});
                  }
               });
            }
         },
         // 市场列表
         getMarketList: function(){
            var vm = this;
               
            Custom.ajaxFn('/Market/GetList',{
               vm:vm,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data;
                     vm.search.marketId = list[0];

                     vm.markets = list;
                     vm.getTradeList();
                  }else{
                     Custom.isSelected({title: '提示',txt: res.errorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '获取失败，'+res.statusText,index: -1});
               }
            });
         },
         // 分页
         pageFn: function(index){
            var vm = this;
            vm.search.pageIndex = index;
            vm.getTradeList();
         }
      },
      components:{
         Page
      },
      replace: true
   }
</script>