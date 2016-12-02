<template>
   <div id="content" class="content">
      <h1 class="page-header">币种列表 <small>币种维护<!-- <Test></Test>{{arr[0]}} --></small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">币种列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="currency-lock">锁定</button>
                     <button class="btn btn-inverse" data-id="currency-dLock">普通解锁</button>
                     <button class="btn btn-inverse" data-id="currency-fLock">强制解锁</button>
                     <button class="btn btn-inverse" data-id="currency-relieveGugVali">解除谷歌身份验证</button>
                     <button class="btn btn-inverse" data-id="currency-phoneUnlock">解除手机锁定</button>
                     <button class="btn btn-inverse" data-id="currency-setUserVip">设置用户VIP等级</button>
                  </div>
                  <div class="col-xs-4 col-md-4 dataTable-filter text-right">
                     <label for="input-filter">
                        <span>搜索</span>
                        <input type="text" class="form-control input-sm" id="input-filter" placeholder="输入进行搜索..." />
                     </label>
                  </div>
                  <div class="clearfix"></div>
                  <table id="currency-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>Id</th>
                           <th>Code</th>
                           <th>充值固定费用/笔</th>
                           <th>充值费率</th>
                           <th>提现最低费用/笔</th>
                           <th>提现费率</th>
                           <th>提现限额/日</th>
                           <th>C0/月</th>
                           <th>C1/月</th>
                           <th>C2/月</th>
                           <th>提现最小限额/笔</th>
                           <th>提现最大限额/笔</th>
                           <th>VerifyLine</th>
                           <th>needConfirm</th>
                           <th>safeConfirm</th>
                           <th>是否禁用</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td>1</td>
                           <td>cny</td>
                           <td>0</td>
                           <td>0 %</td>
                           <td>2</td>
                           <td>1 %</td>
                           <td>500,000.0000</td>
                           <td>30,000.0000</td>
                           <td>100,000.0000</td>
                           <td>1,000,000.0000</td>
                           <td>100.0000</td>
                           <td>50,000.0000</td>
                           <td>0.0000</td>
                           <td>0</td>
                           <td>1</td>
                           <td>No</td>
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
   //import Test from './test'
   export default {
      name: 'currency',
      data(){
         return {
            search: '',
            //arr: []
         }
      },
      mounted(){
         var vm = this;

         vm.getCurrencyList();
      },
      /*components: {
         Test
      },
      events: {
         'css-fn': function(params){
            var vm = this;
            console.log(params);
            vm.arr.push(params);
         }
      },*/
      methods:{
         // 获取币种列表
         getCurrencyList: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/GetList',{
               data: {queryText: vm.search,page: 1,pageSize: 10},
               callback: function(res){
                  if(res.IsSuccess){
                     
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 添加币种
         addCurrency: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/GetList',{
               data: {queryText: '',page: 1,pageSize: 10},
               callback: function(res){
                  if(res.IsSuccess){
                     
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