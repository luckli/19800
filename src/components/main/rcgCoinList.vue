<template>
   <div id="content" class="content">
      <h1 class="page-header">虚拟币充值列表 <small>虚拟币充值查询</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">虚拟币充值列表</h4></div>
               <div class="panel-body">
                  <form class="form-inline text-right">
                     <div class="form-group">
                        <label for="">币种</label>
                        <select v-model="search.currencyId" class="form-control input-sm" @change="toSearch()">
                           <option v-for="type in CTypeList" :value="type.Id">{{type.Code}}</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <input type="text" class="form-control input-sm" v-model="search.queryText" @input="toSearch()" placeholder="输入email进行搜索..." />
                     </div>
                     <div class="input-daterange input-group group-date" id="datepicker">
                        <input type="text" class="input-sm form-control date-range" v-model="search.beginDate" @change="toSearch()" readonly />
                        <span class="input-group-addon">to</span>
                        <input type="text" class="input-sm form-control date-range" v-model="search.endDate" @change="toSearch()" readonly />
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
                        <tr v-for="item in items">
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
   import Custom from '../../assets/js/custom'
   export default{
      name: 'cashCny',
      data(){
         return{
            items: [],
            CTypeList: [],
            search: {queryText: '',currencyId: 'btc',status: 1,beginDate: '',endDate: '',pageIndex: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         vm.getCoinDepositList();
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
         });
      },
      methods:{
         // 获取虚拟币充值列表
         getCoinDepositList: function(){
            var vm = this;

            Custom.ajaxFn('/CoinDeposit/GetList',{
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                     }
                     vm.items = list;
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取币种列表
         getCurrencyTypeList: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/GetList',{
               data: {queryText: '',pageIndex: 1,pageSize: 10},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.CTypeList = res.Data.Items;
                     vm.search.currencyId = res.Data.Items[0].Id;
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 搜索
         toSearch: function(){
            var vm = this;

            console.log(vm.search)
            vm.getCoinDepositList();
         }
      },
      replace: true
   }
</script>