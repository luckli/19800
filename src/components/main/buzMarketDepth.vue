<template>
   <div id="content" class="content">
      <h1 class="page-header">市场深度 <small>市场实时订单深度</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-body">
                  <form class="form-inline">
                     <div class="form-group">
                        <select class="form-control" v-model="marketObj.marketId" @change="getMarketDepth()">
                           <option v-for="market in markets" :value="market.Id">{{market.val}}</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <select class="form-control" v-model="marketObj.precision" @change="getMarketDepth()">
                           <option v-for="depth in depths" :value="depth.Id">{{depth.val}}</option>
                        </select>
                     </div>
                     <div class="form-group" style="margin-left: 10px;">
                        <label for="limit">显示深度</label>
                        <input type="number" id="limit" class="form-control" placeholder="请输入显示深度" @input="getMarketDepth()" v-model="marketObj.limit" />
                     </div>
                  </form>
               </div>
            </div>
         </div>
         <div class="col-md-6 col-sm-6">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">买单</h4></div>
               <div class="panel-body">
                  <table class="table table-striped">
                     <thead>
                        <tr>
                           <th></th>
                           <th>价格</th>
                           <th>挂单量</th>
                           <th>挂单金额</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="(list,index) in items.BidList">
                           <td>买{{index+1}}</td>
                           <td>{{list.Price}}</td>
                           <td>{{list.Amount}}</td>
                           <td>{{list.Total}}</td>
                        </tr>
                        <tr v-if="0 == items.BidList.length">
                           <td colspan="4" style="text-align: center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
         <div class="col-md-6 col-sm-6">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">卖单</h4></div>
               <div class="panel-body">
                  <table class="table table-striped">
                     <thead>
                        <tr>
                           <th></th>
                           <th>价格</th>
                           <th>挂单量</th>
                           <th>挂单金额</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="list in items.AskList">
                           <td>卖1</td>
                           <td>{{list.Price}}</td>
                           <td>{{list.Amount}}</td>
                           <td>{{list.Total}}</td>
                        </tr>
                        <tr v-if="0 == items.AskList.length">
                           <td colspan="4" style="text-align: center;">无数据</td>
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
   import Custom from '../../assets/js/custom'
   export default{
      name: 'marketDepth',
      data(){
         return {
            items: {AskList:[],BidList: []},
            marketObj: {marketId: '',limit: 10,precision: 2},
            markets: [{Id: 0,val: '请选择市场'}],
            depths: [{Id: 0,val: '请选择深度'},{Id: 2,val: 2},{Id: 4,val: 4},{Id: 6,val: 6},{Id: 8,val: 8}]
         }
      },
      mounted(){
         var vm = this;

         vm.getMarketList();
      },
      methods:{
         // 获取市场深度
         getMarketDepth: function(){
            var vm = this;
            if(vm.marketObj.marketId){

               Custom.ajaxFn('/Market/GetDepth',{
                  data: vm.marketObj,
                  vm:vm,
                  callback: function(res){
                     if(res.IsSuccess){
                        vm.items = res.Data;
                     }
                  },
                  errorCallback: function(res){
                     Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
                  }
               });
            }
         },
         // 获取市场列表
         getMarketList: function(){
            var vm = this;

            Custom.ajaxFn('/Market/GetList',{
               vm:vm,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data;
                     for(var i = 0;i<list.length;i++){
                        vm.markets.push({Id: list[i],val: list[i]});
                     }
                     if(0<vm.markets.length){
                        vm.marketObj.marketId = vm.markets[1].Id;
                     }else{
                        vm.marketObj.marketId = vm.markets[0].Id;
                     }
                     vm.getMarketDepth();
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         }
      },
      replace:true
   }
</script>