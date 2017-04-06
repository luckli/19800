<template>
   <div id="content" class="content">
      <h1 class="page-header">用户登陆日志 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">用户登陆日志</h4></div>
               <div class="panel-body">
                  <table id="login-table" class="table table-striped table-bordered table-box">
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
                  </table>
                  <div>
                     <label>显示第 <span>{{(search.page*search.pageSize)-9}}</span> 至 <span>{{search.page*search.pageSize}}</span> 项结果，共 <span>{{totalItems}}</span> 项</label>
                     <Page class="pull-right" :index="search.page" :size="search.pageSize" :total="total" :callbacks="pageFn"></Page>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<script>
   import Custom from 'custom'
   import Page from 'page'
   export default {
      name: 'loginLog',
      data(){
         return{
            items: [],
            total: 0,
            totalItems: 0,
            search: {type: 1,page: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         vm.getPageList();
      },
      methods:{
         // 获取列表
         getPageList: function(){
            var vm = this;

            Custom.ajaxFn('/user/GetLogs',{
               data: vm.search,
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data;

                     vm.total = res.Data.TotalPage;
                     vm.totalItems = res.Data.TotalItems;
                     vm.search.page = res.Data.CurrentPage;
                  }else{
                     vm.items = [];
                     Custom.isSelected({title: '提示',txt: '获取列表失败,'+res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         pageFn: function(index){
            var vm = this;
            vm.search.page = index;
            vm.getCurrencyList();
         }
      },
      components:{
         Page
      },
      replace: true
   }
</script>