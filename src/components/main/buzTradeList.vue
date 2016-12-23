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
                        <input type="text" class="input-sm form-control date-range" placeholder="开始时间" v-model="search.beginDate" @change="getTradeList()" readonly />
                        <span class="input-group-addon">to</span>
                        <input type="text" class="input-sm form-control date-range" placeholder="结束时间" v-model="search.endDate" @change="getTradeList()" readonly />
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
                           <td>{{item.BidUserName}}</td>
                           <td>{{item.AskUserName}}</td>
                           <td>{{item.Price}}</td>
                           <td>{{item.Volume}}</td>
                           <td>{{item.Amount}}</td>
                           <td>{{item.CreatedAt}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="6" style="text-align:center;">无数据</td>
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
   export default {
      name: 'trade',
      data(){
         return{
            items: [],
            markets: [],
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
            vm.getTradeList();
         });
      },
      watch: {
         search(val,val2){
            console.log(val,val2);
         }
      },
      methods:{
         // 获取成交记录表
         getTradeList: function(){
            var vm = this;

            Custom.ajaxFn('/Market/GetTradeList',{
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data.Items;
                  }else{
                     vm.items = [];
                     Custom.isSelected({title: '提示',txt: '获取成交记录，'+res.errorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败，'+res.statusText,index: -1});
               }
            });
         },
         // 市场列表
         getMarketList: function(){
            var vm = this;
               
            Custom.ajaxFn('/Market/GetList',{
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
         // 请选择一个管理员
         IsSelected: function(title,txt){
            var vm = this;
            
            return Custom.isSelected({title: title,txt: txt,index: vm.item});
         }
      },
      
      replace: true
   }
</script>