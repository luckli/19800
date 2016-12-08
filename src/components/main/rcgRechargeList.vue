<template>
   <div id="content" class="content">
      <h1 class="page-header">充值码列表 <small>充值码列表</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">账户余额列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="recharge-generate">生成充值码</button>
                     <button class="btn btn-inverse" data-id="recharge-destroy">销毁充值码</button>
                     <button class="btn btn-inverse" data-id="recharge-mngDestroy">管理员销毁充值码</button>
                     <button class="btn btn-inverse" data-id="recharge-mngView">管理员查看所有充值码</button>
                     <button class="btn btn-inverse" data-id="recharge-csOnlySeeMyself">查看自己的充值码</button>
                  </div>
                  <div class="col-xs-4 col-md-4 radio-status text-right">
                     <label><input type="radio" name="status" value="0" v-model="status" @change="getList()" /><span>全部</span></label>
                     <label><input type="radio" name="status" value="1" v-model="status" @change="getList()" /><span>未使用</span></label>
                     <label><input type="radio" name="status" value="2" v-model="status" @change="getList()" /><span>已使用</span></label>
                     <label><input type="radio" name="status" value="3" v-model="status" @change="getList()" /><span>已销毁</span></label>
                  </div>
                  <div class="clearfix"></div>
                  <table id="account-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>Id</th>
                           <th>收款账号</th>
                           <th>金额</th>
                           <th>状态</th>
                           <th>创建人</th>
                           <th>创建日期</th>
                           <th>创建日期{{0 == items.length}}</th>
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
                           <td>{{item.UpdatedAt}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="7" style="text-align: center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 生成充值码 -->
      <div class="modal fade" id="rcg-generate">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">生成充值码</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">资金来源ID<span>*</span></label>
                        <div class="col-md-6">
                           <select v-model="genObj.fundSourceId" class="form-control">
                              <option v-for="bank in banks" :value="bank.Id">{{bank.val}}</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">充值码金额<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="genObj.amount" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">充值码密码<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="genObj.password" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="generateCode()">生成</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 生成充值码 -->

      <!-- 销毁充值码 -->
      <div class="modal fade" id="rcg-destroy">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认要销毁该充值码吗？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">资金来源ID<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="item" readonly />
                        </div>
                     </div>
                     <!-- <div class="form-group">
                        <label class="col-md-4 control-label custom-label">充值码金额<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="genObj.amount" readonly />
                        </div>
                     </div> -->
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="destroyMyCode()">销毁</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 销毁充值码 -->

   </div>
</template>
<script>
   import Custom from '../../assets/js/custom'
   export default{
      name: 'rcgList',
      data(){
         return{
            item: -1,
            genObj: {fundSourceId: '',amount: 0,password: ''},
            pageObj: {index: 1,size: 10},
            banks: [],
            status: 0,
            items: []
         }
      },
      mounted(){
         var vm =this;

         vm.getList();
         Custom.selectItem('#account-table',vm.item,function(res){
            vm.item = res;
         });
         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            vm.genObj = {fundSourceId: '',amount: 0,password: ''};
         });
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择需要销毁的充值码";
            if('recharge-generate' == _id){
               $('#rcg-generate').modal('show');
            }else if('recharge-destroy' == _id){
               if(vm.IsSelected(title,info)){
                  $('#rcg-destroy').modal('show');
               }
            }
         });
      },
      methods:{
         // 获取充值码列表
         getList: function(){
            var vm = this;

            vm.getAllRcgList();
            vm.getCodeList();
         },
         // 获取当前用户生成的所有充值码列表
         getAllRcgList: function(){
            var vm = this;

            Custom.ajaxFn('/Deposit/GetMyCodeList',{
               data: {status: vm.status,pageIndex: vm.pageObj.index,pageSize: vm.pageObj.size},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data.Items;
                  }
               },
               errorCallback: function(res){
                  vm.items = [];
                  Custom.isSelected({title: '提示',txt: '查看失败，'+res.statusText,index: -1});
               }
            });
         },
         // 管理员查看所有充值码
         getCodeList: function(){
            var vm = this;

            Custom.ajaxFn('/Deposit/GetCodeList',{
               data: {status: vm.status,pageIndex: vm.pageObj.index,pageSize: vm.pageObj.size},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data.Items;
                  }
               },
               errorCallback: function(res){
                  vm.items = [];
                  Custom.isSelected({title: '提示',txt: '查看失败，'+res.statusText,index: -1});
               }
            });
         },
         // 生成充值码
         generateCode: function(){
            var vm = this;

            Custom.ajaxFn('/Deposit/GenerateCode',{
               data: vm.genObj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getCodeList();
                     $('#rcg-generate').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 销毁充值码
         destroyMyCode: function(){
            var vm = this;

            Custom.ajaxFn('/Deposit/DestroyMyCode',{
               data: {depositCodeId: vm.item},
               callback: function(res){
                  if(res.IsSuccess){
                     $('#rcg-destroy').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 管理员销毁充值码
         destroyCode: function(){
            var vm = this;

            Custom.ajaxFn('/Deposit/DestroyCode',{
               data: {depositCodeId: vm.item},
               callback: function(res){
                  if(res.IsSuccess){
                     $('#rcg-destroy').modal('hide');
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