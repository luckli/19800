<template>
   <div id="content" class="content">
      <h1 class="page-header">额外收支查询 <small>人民币额外收支查询</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">额外收支查询</h4></div>
               <div class="panel-body">
                  <div class="form-inline text-right">
                     <div class="form-group">
                        <label for="">币种</label>
                        <select v-model="search.currencyId" class="form-control input-sm" @change="getTransferList()">
                           <option v-for="type in CTypeList" :value="type.Code">{{type.Code}}</option>
                        </select>
                     </div>
                     <div class="input-daterange input-group group-date" id="datepicker">
                        <input type="text" class="input-sm form-control date-range" placeholder="开始时间" v-model="search.beginDate" @change="getTransferList()" readonly />
                        <span class="input-group-addon">to</span>
                        <input type="text" class="input-sm form-control date-range" placeholder="结束时间" v-model="search.endDate" @change="getTransferList()" readonly />
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="vApply-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>记录ID</th>
                           <th>币种ID</th>
                           <th>交易类型</th>
                           <th>转入地址</th>
                           <th>冷钱包地址</th>
                           <th>金额</th>
                           <th>交易码</th>
                           <th>备注</th>
                           <th>创建时间</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.Id}}</td>
                           <td>{{item.CurrencyId}}</td>
                           <td>{{item.TransferDirection}}</td>
                           <td>{{item.TargetAddress}}</td>
                           <td>{{item.ColdAddress}}</td>
                           <td>{{item.Amount}}</td>
                           <td>{{item.TxNo}}</td>
                           <td>{{item.Remark}}</td>
                           <td>{{item.CreatedAt}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="9" style="text-align: center;">无数据</td>
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
      name: 'extra',
      data(){
         return {
            items: [],
            CTypeList: [],
            search: {currencyId: 1,beginDate: '',endDate: '',pageIndex: 1,pageSize: 10}
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
            vm.getTransferList();
         });
      },
      methods:{
         // 转入冷钱包
         toCoolWallet: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/TransferTo',{
               data: {code: '',coldAddress: '',volume: '',txNo: '',remark: ''},
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                     }
                     vm.items = list;
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 从冷钱包转入到热钱包
         toHotWallet: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/AcceptTransferFrom',{
               data: {code: '',coldAddress: '',hotAddress: '',volume: '',txNo: '',remark: ''},
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                     }
                     vm.items = list;
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 资金账户转出
         accountTransferTo: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/TransferTo',{
               data: {capitalAccountId: '',toOwnerName: '',toAccountType: '',toSubbranch: '',toAccountNumber: '',amount: '',txNo: '',txFee: '',remark: ''},
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                     }
                     vm.items = list;
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 资金账户转入
         accountTransferFrom: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/AcceptTransferFrom',{
               data: {capitalAccountId: '',fromOwnerName: '',fromAccountType: '',fromSubbranch: '',fromAccountNumber: '',amount: '',txNo: '',txFee: '',remark: ''},
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                     }
                     vm.items = list;
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 资金账户的转账列表
         getAccountTransferList: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/GetTransferList',{
               data: {capitalAccountId: '',beginDate: '',endDate: '',pageIndex: '',pageSize: ''},
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                     }
                     vm.items = list;
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 币种的冷热钱包的转账记录列表
         getTransferList: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/GetTransferList',{
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                     }
                     vm.items = list;
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
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

            Custom.ajaxFn('/Currency/VirtualList',{
               callback: function(res){
                  if(res.IsSuccess){
                     vm.CTypeList = res.Data;
                     vm.search.currencyId = res.Data[0].Code;
                     vm.getTransferList();
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         }
      },
      replace: true
   }
</script>