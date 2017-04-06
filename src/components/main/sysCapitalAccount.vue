<template>
   <div id="content" class="content">
      <h1 class="page-header">资金账户列表 <small>资金账户列维护</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">资金账户列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="ca-add">添加资金账户</button>
                     <button class="btn btn-inverse" data-id="ca-lock">锁定</button>
                     <button class="btn btn-inverse" data-id="ca-unlock">解锁</button>
                     <button class="btn btn-inverse" data-id="ca-setDefault">设为默认充值账户</button>
                  </div>
                  <div class="col-xs-4 col-md-4 form-inline text-right">
                     <div class="form-group">
                        <label for="search">搜索</label>
                        <input type="text" class="form-control input-sm" id="search" v-model="search.queryText" @keyup.enter="getCapAccountList()" placeholder="输入账号进行搜索..." />
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="ca-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>开户人</th>
                           <th>账号</th>
                           <th>账户银行</th>
                           <th>余额</th>
                           <th>是否锁定</th>
                           <th>默认账户</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.UserName}}</td>
                           <td>{{item.AccountNumber}}</td>
                           <td>{{item.BankName}}</td>
                           <td>{{item.Balance}}</td>
                           <td><span v-if="1 == item.Status">正常</span><span v-if="2 == item.Status">锁定</span><span v-if="3 == item.Status">禁用</span></td>
                           <td><span v-if="1 == item.IsDefault">默认</span><span v-else>非默认</span></td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="6" style="text-align:center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
                  <div class="clearfix">
                     <label class="pull-left">显示第 <span>{{(search.pageIndex*search.pageSize)-9}}</span> 至 <span>{{search.pageIndex*search.pageSize}}</span> 项结果，共 <span>{{totalItems}}</span> 项</label>
                     <Page class="pull-right" :index="search.pageIndex" :size="search.pageSize" :total="total" :callbacks="pageFn"></Page>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <!-- 添加资金账户 -->
      <div class="modal fade" id="ca-add">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">添加资金账户</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">拥有者姓名<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="aktObj.ownerName" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">币种<span>*</span></label>
                        <div class="col-md-6">
                           <select v-model="aktObj.currencyId" class="form-control">
                              <option v-for="clist in currencyList" :value="clist">{{clist}}</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">账户类型<span>*</span></label>
                        <div class="col-md-6">
                           <select v-model="aktObj.accountType" class="form-control">
                              <option v-for="list in accountList" :value="list.Id">{{list.BankName}}</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">支行名称<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="aktObj.subbranch" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">账户号码<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="aktObj.accountNumber" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toAdd()">添加</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 添加资金账户 -->

      <!-- 锁定/解锁 -->
      <div class="modal fade" id="ca-key">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-show="1==sign">锁定</span><span v-show="2==sign">解锁</span><span v-show="3==sign">确定设置该账户为默认充值账户？</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">账号</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="accountObj.AccountNumber" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toAbout()">{{txt}}</a>
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
   export default {
      name: 'ca',
      data(){
         return {
            items: [],
            item: -1,
            sign: -1,
            txt: '锁定',
            accountObj: {Id: ''},
            aktObj: {userId: '1',currencyId: 0,ownerName: '',accountType: 0,subbranch: '',accountNumber: ''},
            search: {queryText: '',pageIndex: 1,pageSize: 10},
            accountList: [],
            currencyList: [],
            totalItems: 0,
            total: 0
         }
      },
      mounted(){
         var vm = this;

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            if(-1 == vm.sign){
               vm.aktObj = {userId: '1',currencyId: vm.currencyList[0].Id,ownerName: '',accountType: vm.accountList[0].Id,subbranch: '',accountNumber: ''};
            }
         });
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个账户";
            if(('ca-lock' == _id) || ('ca-unlock' == _id)){
               for(var i = 0;i<vm.items.length;i++){
                  if(vm.item == vm.items[i].Id){
                     vm.accountObj = vm.items[i];
                  }
               }
            }
            if('ca-add' == _id){
               vm.sign = -1;
               if(0 == vm.accountList.length){
                  vm.getPayTypeList();
               }
               if(0 == vm.currencyList.length){
                  vm.getCurrencyTypeList();
               }
               $('#ca-add').modal('show');
            }else if('ca-lock' == _id){
               vm.sign = 1;
               vm.txt = '锁定';
               if(vm.IsSelected(title,info)){
                  if(2!=vm.accountObj.Status){
                     $('#ca-key').modal('show');
                  }else{
                     Custom.isSelected({title: title,txt: '已锁定',index: -1});
                  }
               }
            }else if('ca-unlock' == _id){
               vm.sign = 2;
               vm.txt = '解锁';
               if(vm.IsSelected(title,info)){
                  if(1!=vm.accountObj.Status){
                     $('#ca-key').modal('show');
                  }else{
                     Custom.isSelected({title: title,txt: '状态正常',index: -1});
                  }
               }
            }else if('ca-setDefault' == _id){
               vm.sign = 3;
               vm.txt = '确定';
               if(vm.IsSelected(title,info)){
                  $('#ca-key').modal('show');
               }
            }
         });

         Custom.selectItem('#ca-table',vm.item,function(res){
            vm.item = res;
         });

         vm.getCapAccountList();
      },
      methods:{
         // 添加资金账号
         toAdd: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/Create',{
               data: vm.aktObj,
               vm: vm,
               callback: function(res){
                  var msg = '添加成功！';
                  if(res.IsSuccess){
                     $('#ca-add').modal('hide');
                     vm.getCapAccountList();
                  }else{
                     msg = '添加失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 锁定
         toAbout: function(){
            var vm = this,url = '';
            if(1==vm.sign){
               url = '/CapitalAccount/Lock';
            }else if(2==vm.sign){
               url = '/CapitalAccount/Unlock';
            }else if(3==vm.sign){
               url = '/CapitalAccount/SetDefault'
            }

            Custom.ajaxFn(url,{
               data: {accountId: vm.accountObj.Id},
               vm: vm,
               callback: function(res){
                  var msg = '锁定成功！';
                  if(res.IsSuccess){
                     $('#ca-key').modal('hide');
                     vm.getCapAccountList();
                  }else{
                     msg = '锁定失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取资金账户列表
         getCapAccountList: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/GetList',{
               data: vm.search,
               vm: vm,
               callback: function(res){
                  var data = res.Data;
                  if(res.IsSuccess){
                     vm.items = data.Items;

                     vm.search.pageIndex= data.CurrentPage;
                     vm.total = data.TotalPage;
                     vm.totalItems = data.TotalItems;
                  }else{
                     vm.items = [];
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

            Custom.ajaxFn('/Currency/LegalList',{
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.currencyList = res.Data;
                     if(0<res.Data.length){
                        vm.aktObj.currencyId = res.Data[0];
                     }
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取付款账号类型列表
         getPayTypeList: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/GetPayTypeList',{
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.accountList = res.Data;
                     if(0<res.Data.length){
                        vm.aktObj.accountType = res.Data[0].Id
                     }
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         pageFn: function(index){
            var vm = this;
            vm.search.pageIndex=index||1;
            vm.getCapAccountList();
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