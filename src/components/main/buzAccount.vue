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
                           <select v-model="currId" class="form-control input-sm" @change="toChange()">
                              <option v-for="type in CTypeList" :value="type.id">{{type.val}}</option>
                           </select>
                        </div>
                        <div class="form-group">
                           <input type="text" class="form-control input-sm" v-model="search.email" @input="toInput()" placeholder="输入登陆账号进行搜索..." />
                        </div>
                        <div class="form-group">
                           <input type="text" class="form-control input-sm" v-model="search.userId" @input="toInput()" placeholder="输入userid进行搜索..." />
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
      name: 'account',
      data(){
         return{
            currId: -1,
            search: {queryText: '',currencyId: '',pageIndex: 1,pageSize: 10},
            CTypeList: [{id: -1,val:'请选择'},{id: 1,val:'cny'},{id: 2,val:'btc'},{id: 3,val:'ltc'},{id: 4,val:'ctc'}],
            items: []
         }
      },
      mounted(){
         var vm = this;

         vm.getAccountBalanceList();
      },
      methods: {
         // 获取账号余额列表
         getAccountBalanceList: function(){
            var vm = this;

            Custom.ajaxFn('/Account/GetList',{
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     //items[i].UpdatedAt = Custom.dateTimeFormatter(items[i].UpdatedAt);
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         toChange: function(){
            var vm = this;

            vm.search.currencyId = vm.currId;
            if(-1 == vm.currId){return false;}
            vm.getAccountBalanceList();
         },
         toInput: function(){
            var vm = this;

            vm.getAccountBalanceList();
         }
      },
      replace: true
   }
</script>