<template>
   <div id="content" class="content">
      <h1 class="page-header">待处理人民币提现任务列表 <small>财务人员可领取提现任务后进行处理</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">待处理人民币提现任务列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-4 col-md-4 manage-btns">
                     <button class="btn btn-inverse" id="coin-getCash">领取提现</button>
                  </div>
                  <div class="col-xs-8 col-md-8 form-inline text-right">
                     <div class="form-group">
                        <input type="text" class="form-control input-sm" v-model="search.queryText" @keyup.enter="getCnyCashList()" placeholder="输入email进行搜索..." />
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="cashCnyTask-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>用户</th>
                           <th>提现账号</th>
                           <th>应打款金额</th>
                           <th>创建日期</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.Id}}</td>
                           <td>{{item.UserName}}</td>
                           <td>{{item.Email}}</td>
                           <td>{{item.CreatedAt}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
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
   import Custom from 'custom'
   export default{
      name: 'cashCny',
      data(){
         return{
            item: -1,
            items: [],
            search: {queryText: '',pageIndex: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         // 显示弹层
         $('.manage-getCash').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('id');
            if('coin-cashLog' == _id){
               if(vm.IsSelected('提示','请选择需要完成提现记录')){
                  $('#cash-ok').modal('show');
               }
            }
         });
         Custom.selectItem('#cashCnyTask-table',vm.item,function(res){
            vm.item = res;
         });
      },
      methods:{
         // 获取人民币提取任务列表
         getCashTaskList: function(){
            var vm = this;
         }
      },
      replace: true
   }
</script>