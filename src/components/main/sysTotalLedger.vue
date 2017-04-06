<template>
   <div id="content" class="content">
      <h1 class="page-header">总帐簿报表 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">总帐簿报表图表</h4></div>
               <div class="panel-body">
                  <form class="form-inline text-right">
                     <div class="form-group">
                        <label>币种</label>
                        <select v-model="search.currencyId" class="form-control input-sm" @change="getPageList()">
                           <option v-for="type in CTypeList" :value="type">{{type}}</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <input type="number" class="form-control input-sm" v-model="search.limit" @input="getPageList()" placeholder="数据条数限制" />
                     </div>
                  </form>
                  <div class="clearfix"></div>
                  <div id="ledgerChart"></div>
                  <!-- <table id="login-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>编号</th>
                           <th>语句Code</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.Id}}</td>
                           <td>{{item.Key}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="2" style="text-align:center;">无数据</td>
                        </tr>
                     </tbody>
                  </table> -->
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<script>
   import echarts from '../../assets/lib/echarts.min'
   import Custom from 'custom'
   import Page from 'page'
   export default {
      name: 'totalLedger',
      data(){
         return{
            myChart: null,
            CTypeList: [],
            search: {currencyId: '',limit: 200},
            items: {Periods: [],TotalAmounts: [],IncomeAmounts:[],LedgerAmounts: []}
         }
      },
      mounted(){
         var vm = this;

         vm.getCurrencyList();
      },
      methods:{
         // 获取币种列表
         getCurrencyList: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/List',{
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.CTypeList = res.Data;
                     vm.search.currencyId = res.Data[0];

                     vm.getPageList();
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取列表
         getPageList: function(){
            var vm = this;

            Custom.ajaxFn('/Statistics/GetLedgerLineList',{
               data: vm.search,
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data;

                     vm.total = res.Data.TotalPage;
                     vm.totalItems = res.Data.TotalItems;
                     vm.search.page = res.Data.CurrentPage;
                     if(vm.myChart){
                        vm.updateLedgerData();
                     }else{
                        vm.drawLedgerChart();
                     }
                  }else{
                     vm.items = {Periods: [],TotalAmounts: [],IncomeAmounts:[],LedgerAmounts: []};
                     Custom.isSelected({title: '提示',txt: '获取列表失败,'+res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 绘制图表
         drawLedgerChart: function(){
            var vm = this;
            vm.myChart = echarts.init(document.getElementById('ledgerChart'));
            var option = {
               /*title: {
                  text: '系统总报表'
               },*/
               tooltip: {
                  trigger: 'axis'
               },
               legend: {
                  data: ['系统总金额', '真实总金额', '利润']
               },
               grid: {
                  left: '3%',
                  right: '8%',
                  bottom: '3%',
                  containLabel: true
               },
               toolbox: {
                  feature: {
                     dataZoom: {
                        yAxisIndex: false
                     },
                     brush: {
                        type: ['lineX', 'clear']
                     }
                  }
               },
               dataZoom: [
                  {
                     type: 'slider',
                     start: 10,
                     end: 60
                  }
               ],
               xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: vm.items.Periods
               },
               yAxis: {
                  type: 'value'
               },
               series: [
                  {
                     name: '系统总金额',
                     type: 'line',
                     stack: '总量',
                     data: vm.items.TotalAmounts
                  },
                  {
                     name: '真实总金额',
                     type: 'line',
                     stack: '总量',
                     data: vm.items.IncomeAmounts
                  },
                  {
                     name: '利润',
                     type: 'line',
                     stack: '总量',
                     data: vm.items.LedgerAmounts
                  }
               ]
            };
            vm.myChart.setOption(option);
            $(window).resize(function(){
               vm.myChart.resize();
            });
         },
         // 更新图表数据
         updateLedgerData: function(){
            var vm = this,
               option = {
                  xAxis: {
                     type: 'category',
                     boundaryGap: false,
                     data: vm.items.Periods
                  },
                  series: [
                     {
                        name: '系统总金额',
                        type: 'line',
                        stack: '总量',
                        data: vm.items.TotalAmounts
                     },
                     {
                        name: '真实总金额',
                        type: 'line',
                        stack: '总量',
                        data: vm.items.IncomeAmounts
                     },
                     {
                        name: '利润',
                        type: 'line',
                        stack: '总量',
                        data: vm.items.LedgerAmounts
                     }
                  ]
               };
            vm.myChart.setOption(option);
         }
      },
      replace: true
   }
</script>