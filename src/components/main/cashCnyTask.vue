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
                        <label for="">搜索</label>
                        <input type="text" class="form-control input-sm" v-model="search.queryText" @keyup.enter="getCashTaskList()" placeholder="输入email进行搜索..." />
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
                           <td>
                              <span class="bold">姓名：</span>{{item.UserName}}<br />
                              <span class="bold">Email：</span>{{item.Email}}
                           </td>
                           <td>
                              <span class="bold">银行：</span>{{item.BankName}}<br />
                              <span class="bold">账号：</span>{{item.AccountNumber}}<br />
                              <span class="bold">支行：</span>{{item.Subbranch}}<br />
                              <span class="bold">打款金额：</span>{{item.PayAmount}}
                           </td>
                           <td>{{item.CreatedAt}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="4" style="text-align: center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
                  <div>
                     <label>显示第 <span>{{(search.pageIndex*search.pageSize)-9}}</span> 至 <span>{{search.pageIndex*search.pageSize}}</span> 项结果，共 <span>{{totalItems}}</span> 项</label>
                     <Page class="pull-right" :index="search.pageIndex" :size="search.pageSize" :total="total" :callbacks="pageFn"></Page>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <!-- 领取任务 -->
      <div class="modal fade" id="mod-getCash">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">领取任务</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">提现ID</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="item" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="getTask()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 领取任务 -->
   </div>
</template>
<script>
   import Custom from 'custom'
   import Page from 'page'
   export default{
      name: 'cashCny',
      data(){
         return{
            item: -1,
            items: [],
            total: 0,
            totalItems: 0,
            search: {queryText: '',pageIndex: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         vm.getCashTaskList();
         // 显示弹层
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('id'),title = '提示',info="请选择需要完成提现记录";
            if('coin-getCash' == _id){
               if(vm.IsSelected(title,info)){
                  $('#mod-getCash').modal('show');
               }
            }
         });
         Custom.selectItem('#cashCnyTask-table',vm.item,function(res){
            vm.item = res;
         });
      },
      methods:{
         // 领取任务
         getTask: function(){
            var vm = this;

            Custom.ajaxFn('/Withdraw/Assign',{
               data: {withdrawId: vm.item},
               vm: vm,
               callback: function(res){
                  var msg = '领取成功！';
                  if(res.IsSuccess){
                     Custom.isSelected({title: '提示',txt: '领取成功！',index: -1});
                     vm.getCashTaskList();
                     $('#mod-getCash').modal('hide');
                  }else{
                     msg = '领取失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取人民币提取任务列表
         getCashTaskList: function(){
            var vm = this;

            Custom.ajaxFn('/Withdraw/GetAssignList',{
               data: vm.search,
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                     }
                     vm.items = list;
                     vm.total = res.Data.TotalPage;
                     vm.search.pageIndex = res.Data.CurrentPage;
                     vm.totalItems = res.Data.TotalItems;
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 请选择一个管理员
         IsSelected: function(title,txt){
            var vm = this;
            
            return Custom.isSelected({title: title,txt: txt,index: vm.item});
         },
         pageFn: function(index){
            var vm = this;
            vm.search.pageIndex = index;
            vm.getCashTaskList();
         }
      },
      components:{
         Page
      },
      replace: true
   }
</script>