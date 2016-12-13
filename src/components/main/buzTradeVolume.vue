<template>
   <div id="content" class="content">
      <h1 class="page-header">成交量报表 <small>成交量报表</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">成交量报表</h4></div>
               <div class="panel-body">
                  <form class="form-inline">
                     <div class="input-daterange input-group group-date" id="datepicker">
                        <input type="text" class="input-sm form-control date-range" v-model="search.beginDate" @change="getTradeList()" readonly />
                        <span class="input-group-addon">to</span>
                        <input type="text" class="input-sm form-control date-range" v-model="search.endDate" @change="getTradeList()" readonly />
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
            search:{beginDate: '',endDate: ''}
         }
      },
      mounted(){
         var vm = this;

         vm.getTradeList();

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
         // 获取成交量报表
         getTradeList: function(){
            var vm = this;
            //vm.items = [{Id: 0,UserName: 'sky'}];
            console.log(vm.search);
         }
      },
      replace: true
   }
</script>