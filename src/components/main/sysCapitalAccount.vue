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
                  <div class="clearfix"></div>
                  <table id="ca-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>开户人</th>
                           <th>账户类型</th>
                           <th>账号</th>
                           <th>账户银行</th>
                           <th>余额</th>
                           <th>是否锁定</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td>栾爱新</td>
                           <td>支付宝</td>
                           <td>15000648745</td>
                           <td>中国建设银行</td>
                           <td>183,982.0000</td>
                           <td>已锁定</td>
                        </tr>
                     </tbody>
                  </table>
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
                           <input type="text" class="form-control" v-model="aktObj.accountNumber" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="1==sign" @click="toLock()">锁定</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="2==sign" @click="toUnlock()">解锁</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="3==sign" @click="setDefaultAccount()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 锁定/解锁 -->
   </div>
</template>
<script>
   import Custom from '../../assets/js/custom'
   export default {
      name: 'ca',
      data(){
         return {
            items: [],
            item: -1,
            sign: 1,
            aktObj: {userId: '',currencyId: '',ownerName: '',accountType: 0,subbranch: '',accountNumber: ''},
            accountList: [{Id: 0,BankName: '支付宝'},{Id: 1,BankName: '财付通'},{Id: 2,BankName: '银行'}]
         }
      },
      mounted(){
         var vm = this;

         vm.getPayTypeList();

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个账户";
            if('ca-add' == _id){
               $('#ca-add').modal('show');
            }else if('ca-lock' == _id){
               vm.sign = 1;
               if(vm.IsSelected(title,info)){
                  $('#ca-key').modal('show');
               }
            }else if('ca-unlock' == _id){
               vm.sign = 2;
               if(vm.IsSelected(title,info)){
                  $('#ca-key').modal('show');
               }
            }else if('ca-setDefault' == _id){
               vm.sign = 3;
               if(vm.IsSelected(title,info)){
                  $('#ca-key').modal('show');
               }
            }
         });
      },
      methods:{
         // 添加资金账号
         toAdd: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/Create',{
               data: vm.aktObj,
               callback: function(res){
                  if(res.IsSuccess){
                     //vm.items = res.Data.Items;
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 锁定
         toLock: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/Lock',{
               data: {accountId: ''},
               callback: function(res){
                  if(res.IsSuccess){
                     //vm.items = res.Data.Items;
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 解锁
         toUnlock: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/Unlock',{
               data: {accountId: ''},
               callback: function(res){
                  if(res.IsSuccess){
                     //vm.items = res.Data.Items;
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 设置默认账户
         setDefaultAccount: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/Unlock',{
               data: {accountId: ''},
               callback: function(res){
                  if(res.IsSuccess){
                     //vm.items = res.Data.Items;
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
               callback: function(res){
                  if(res.IsSuccess){
                     //vm.items = res.Data.Items;
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 请选择一个管理员
         IsSelected: function(title,txt){
            var vm = this;
            
            return Custom.isSelected({title: title,txt: txt,index: vm.item});
         }
      },
      replace: true
   }
</script>