<template>
   <div id="content" class="content">
      <h1 class="page-header">账户余额列表 <small>账户余额查询</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">账户余额列表</h4></div>
               <div class="panel-body">
                  <div class="manage-btns">
                     <button class="btn btn-inverse" data-id="account-lock">锁定</button>
                     <button class="btn btn-inverse" data-id="account-unlock">解锁</button>
                  </div>
                  <div class="dataTable-filter ">
                     <form class="form-inline text-right">
                        <div class="form-group">
                           <label for="">币种</label>
                           <select v-model="search.currencyId" class="form-control input-sm" @change="getAccountBalanceList()">
                              <option v-for="type in CTypeList" :value="type">{{type}}</option>
                           </select>
                        </div>
                        <div class="form-group">
                           <input type="text" class="form-control input-sm" v-model="search.queryText" @keyup.enter="getAccountBalanceList()" placeholder="输入用户名进行搜索..." />
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
                        <tr v-for="item in items" :data-id="item.Id">
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
                  <div>
                     <label>显示第 <span>{{(search.pageIndex*search.pageSize)-9}}</span> 至 <span>{{search.pageIndex*search.pageSize}}</span> 项结果，共 <span>{{totalItems}}</span> 项</label>
                     <Page class="pull-right" :index="search.pageIndex" :size="search.pageSize" :total="total" :callbacks="pageFn"></Page>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <!-- 锁定/解锁 -->
      <div class="modal fade" id="mod-operate">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-show="1==sign">锁定</span><span v-show="2==sign">解锁</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">用户Id</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" disabled v-model="obj.userId" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">币种Id</label>
                        <div class="col-md-6">
                           <select v-model="obj.currencyId" class="form-control input-sm">
                              <option v-for="type in CTypeList" :value="type">{{type}}</option>
                           </select>
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <button type="button" class="btn btn-sm btn-white" data-dismiss="modal">关闭</button>
                  <button type="button" class="btn btn-sm btn-success" @click="toOperate()">确定</button>
               </div>
            </div>
         </div>
      </div>
      <!-- 锁定/解锁 -->
   </div>
</template>
<script>
   import Custom from 'custom'
   import Page from 'page'
   export default{
      name: 'account',
      data(){
         return{
            search: {queryText: '',currencyId: '',pageIndex: 1,pageSize: 10},
            obj: {userId: '',currencyId: ''},
            CTypeList: ['请选择'],
            items: [],
            total: 0,
            totalItems: 0,
            item: -1,
            sign: -1
         }
      },
      mounted(){
         var vm = this;

         vm.getCurrencyTypeList();
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个用户记录";
            if('account-lock' == _id){
               vm.sign = 1;
               if(vm.IsSelected(title,info)){
                  $('#mod-operate').modal('show');
               }
            }else if('account-lock' == _id){
               vm.sign = 2;
               if(vm.IsSelected(title,info)){
                  $('#mod-operate').modal('show');
               }
            }
         });
         Custom.selectItem('#account-table',vm.item,function(res){
            vm.item = res;
            vm.obj.userId = res;
            console.log(res);
         });
      },
      methods: {
         // 锁定/解锁
         toOperate: function(){
            var vm = this,url = '/Account/Lock';
            if(2==vm.sign){
               url = '/Account/Unlock';
            }
            Custom.ajaxFn(url,{
               data: vm.obj,
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     $('#mod-operate').modal('hide');
                     vm.getAccountBalanceList();
                  }else{
                     Custom.isSelected({title: '提示',txt: '操作失败,'+res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取账号余额列表
         getAccountBalanceList: function(){
            var vm = this,data = JSON.parse(JSON.stringify(vm.search));
            if('请选择'==data.currencyId){
               data.currencyId = '';
            }
            Custom.ajaxFn('/Account/GetList',{
               data: data,
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i =0;i<list.length;i++){
                        list[i].UpdatedAt = Custom.dateTimeFormatter(list[i].UpdatedAt);
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
         // 获取币种列表
         getCurrencyTypeList: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/List',{
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     for(var i = 0;i<res.Data.length;i++){
                        vm.CTypeList.push(res.Data[i]);
                     }
                     vm.search.currencyId = vm.CTypeList[0];
                     vm.obj.currencyId = vm.CTypeList[0];
                     vm.getAccountBalanceList();
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         pageFn: function(index){
            var vm = this;
            vm.search.pageIndex = index;
            vm.getPageList();
         },
         // 请选择一个管理员
         IsSelected: function(title,txt){
            var vm = this;
            
            return Custom.isSelected({title: title,txt: txt,index: vm.item});
         }
      },
      components:{
         Page
      },
      replace: true
   }
</script>