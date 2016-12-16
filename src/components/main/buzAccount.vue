<template>
   <div id="content" class="content">
      <h1 class="page-header">账户余额列表 <small>账户余额查询</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">账户余额列表</h4></div>
               <div class="panel-body">
                  <div class="dataTable-filter ">
                     <form class="form-inline text-right">
                        <div class="form-group">
                           <label for="">币种</label>
                           <select v-model="search.currencyId" class="form-control input-sm" @change="getAccountBalanceList()">
                              <option v-for="type in CTypeList" :value="type.id">{{type.val}}</option>
                           </select>
                        </div>
                        <div class="form-group">
                           <input type="text" class="form-control input-sm" v-model="search.queryText" @keyup.enter="getAccountBalanceList()" placeholder="输入用户Id进行搜索..." />
                        </div>
                     </form>
                  </div>
                  <div class="clearfix"></div>
                  <table id="account-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>用户Id</th>
                           <th>用户</th>
                           <th>可用余额</th>
                           <th>挂单金额</th>
                           <th>合计</th>
                           <th>更新时间</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items">
                           <td>{{item.Id}}</td>
                           <td>{{item.UserName}}</td>
                           <td>{{item.Balance}}</td>
                           <td>{{item.LockedAmount}} %</td>
                           <td>{{item.TotalAmount}}</td>
                           <td>{{item.UpdatedAt}}</td>
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
   import Custom from 'custom'
   export default{
      name: 'account',
      data(){
         return{
            search: {queryText: '',currencyId: '',pageIndex: 1,pageSize: 10},
            CTypeList: [],
            items: []
         }
      },
      mounted(){
         var vm = this;

         vm.getCurrencyTypeList();
      },
      methods: {
         // 获取账号余额列表
         getAccountBalanceList: function(){
            var vm = this;

            Custom.ajaxFn('/Account/GetList',{
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data.Items;
                     //items[i].UpdatedAt = Custom.dateTimeFormatter(items[i].UpdatedAt);
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
                     vm.getAccountBalanceList();
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