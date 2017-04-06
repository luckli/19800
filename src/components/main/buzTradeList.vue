<template>
   <div id="content" class="content">
      <h1 class="page-header">成交记录 <small>成交记录</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">成交记录</h4></div>
               <div class="panel-body">
                  <form class="form-inline">
                     <div class="form-group">
                        <label for="markets">市场</label>
                        <select v-model="search.marketId" class="form-control input-sm" @change="getTradeList()">
                           <option v-for="mk in markets" :value="mk">{{mk}}</option>
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
                           <th>用户(买)</th>
                           <th>用户(卖)</th>
                           <th>单价</th>
                           <th>数量</th>
                           <th>成交金额</th>
                           <th>成交日期</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items">
                           <td>
                              <span class="bold">用户Id：</span>{{item.BidUserId}}<br />
                              <span class="bold">订单Id：</span>{{item.BidOrderId}}
                           </td>
                           <td>
                              <span class="bold">用户Id：</span>{{item.AskUserId}}<br />
                              <span class="bold">订单Id：</span>{{item.AskOrderId}}
                           </td>
                           <td>{{item.Price}}</td>
                           <td>{{item.Volume}}</td>
                           <td>{{item.Amount}}</td>
                           <td>{{item.CreateTime}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="6" style="text-align:center;">无数据</td>
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
            markets: [],
            totalItems: 0,
            total: 0,
            search:{beginDate: '',endDate: '',marketId: '',pageIndex: 1,pageSize: 10}
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
         // 获取成交记录表
         getTradeList: function(){
            var vm = this;
            if((vm.search.beginDate && ''!=vm.search.beginDate) &&(vm.search.endDate && ''!=vm.search.endDate)){
               Custom.ajaxFn('/Market/GetTradeList',{
                  data: vm.search,
                  vm:vm,
                  callback: function(res){
                     if(res.IsSuccess){
                        var list = res.Data.Items;
                        for(var i=0;i<list.length;i++){
                           list[i].CreateTime = Custom.dateTimeFormatter(list[i].CreateTime);
                        }
                        vm.items = list;
                        vm.total = res.Data.TotalPage;
                        vm.search.pageIndex = res.Data.CurrentPage;
                        vm.totalItems = res.Data.TotalItems;
                     }else{
                        vm.items = [];
                        Custom.isSelected({title: '提示',txt: '获取成交记录，'+res.errorMsg,index: -1});
                     }
                  },
                  errorCallback: function(res){
                     Custom.isSelected({title: '提示',txt: '请求失败，'+res.statusText,index: -1});
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
                     Custom.isSelected({title: '提示',txt: '获取市场列表,'+res.errorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败，'+res.statusText,index: -1});
               }
            });
         },
         pageFn: function(index){
            var vm = this;
            vm.search.pageIndex = index;
            vm.getTradeList();
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