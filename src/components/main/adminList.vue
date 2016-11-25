<template>
   <div id="content" class="content">
      <h1 class="page-header">管理员列表 <small>管理员维护及权限控制</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">管理员列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" id="manage-add" data-target="#mng-add" data-toggle="modal">添加管理员</button>
                     <button class="btn btn-inverse" id="manage-lock">锁定</button>
                     <button class="btn btn-inverse" id="manage-unlock">解除锁定</button>
                     <button class="btn btn-inverse" id="manage-set-role">设置角色</button>
                     <button class="btn btn-inverse" id="manage-lock-key">绑定密钥</button>
                     <button class="btn btn-inverse" id="manage-unbind-otp">解除谷歌otp绑定</button>
                     <button class="btn btn-inverse" id="manage-reset-pwd">重置登陆密码</button>
                  </div>
                  <div class="col-xs-4 col-md-4 dataTable-filter text-right">
                     <label for="input-filter">
                        <span>搜索</span>
                        <input type="text" class="form-control input-sm" id="input-filter" placeholder="输入登陆账号进行搜索..." />
                     </label>
                  </div>
                  <table id="manage-table" class="table table-striped table-bordered">
                     <thead>
                        <tr>
                           <th>登陆账号</th>
                           <th>昵称</th>
                           <th>是否锁定</th>
                           <th>角色</th>
                           <th>充值码额度</th>
                           <th>最后登陆时间</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in mngObj.Items" :data-id="item.Id">
                           <td>{{item.Account}}</td>
                           <td>{{item.NickName}}</td>
                           <td>{{item.IsLocked ? '已锁定': 'NO'}}</td>
                           <td>{{item.RoleNames}}</td>
                           <td>{{item.DepositAmount}}</td>
                           <td>{{item.CreateTime}}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 添加管理员  -->
      <div class="modal fade" id="mng-add">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">添加管理员</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="add-user">用户名<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="add-user" v-model="mngAdd.account" placeholder="请输入用户名" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="add-name">昵称<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="add-name" v-model="mngAdd.nickName" placeholder="请输入昵称" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="add-pwd">密码<span>*</span></label>
                        <div class="col-md-6">
                           <input type="password" class="form-control" id="add-pwd" v-model="mngAdd.password" placeholder="请输入密码" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="mngAdd()" @keyup.enter="mngAdd()">保存</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 添加管理员 -->

      <!-- 锁定 -->
      <div class="modal fade" id="mng-lock">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认要锁定吗？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" name="lock-user" readonly placeholder="请输入用户名" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success">锁定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 锁定 -->

      <!-- 解除锁定 -->
      <div class="modal fade" id="mng-unlock">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认要解除锁定吗？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" name="unlock-user" readonly placeholder="请输入用户名" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success">锁定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 解除锁定 -->

      <!-- 设置角色 -->
      <div class="modal fade" id="mng-set-role">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">设置角色</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" name="set-user" readonly placeholder="请输入用户名" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">角色<span>*</span></label>
                        <div class="col-md-6">
                           <ul>
                              <li><label><input type="checkbox" name="roles" /><span>FinancialStaff</span></label></li>
                              <li><label><input type="checkbox" name="roles" /><span>FinancialManager</span></label></li>
                              <li><label><input type="checkbox" name="roles" /><span>CustomerService</span></label></li>
                              <li><label><input type="checkbox" name="roles" /><span>Editor</span></label></li>
                           </ul>
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success">锁定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 设置角色 -->

      <!-- 绑定密钥  -->
      <div class="modal fade" id="mng-lock-key">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">绑定密钥</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="key-user">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="key-user" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="key-TF-KEY">TF-KEY</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="key-TF-KEY" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success">绑定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 绑定密钥 -->

      <!-- 解除谷歌otp绑定 -->
      <div class="modal fade" id="mng-unbind-otp">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认要解除谷歌otp锁定吗？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" name="opt-user" readonly placeholder="请输入用户名" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success">解除</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 解除谷歌otp绑定 -->

      <!-- 重置登陆密码  -->
      <div class="modal fade" id="mng-reset-pwd">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">重置登陆密码</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="reset-user">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="reset-user" v-model="mngReset.user" readonly/>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="reset-pwd">新密码<span>*</span></label>
                        <div class="col-md-6">
                           <input type="password" class="form-control" v-model="mngReset.pwd" id="reset-pwd" placeholder="请输入密码" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="reset-repwd">确认新密码<span>*</span></label>
                        <div class="col-md-6">
                           <input type="password" class="form-control" v-model="mngReset.repwd" id="reset-repwd" placeholder="请再次输入密码" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="mngModify">保存</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 重置登陆密码 -->
   </div>
</template>
<script>
   import '../../../static/lib/jquery.gritter'
   import Custom from '../../assets/js/custom'
   export default {
      name: 'adminList',
      mounted(){
         var vm = this;
         vm.mngList();
         vm.item = -1;

         /*选定管理员*/
         $('#manage-table').on('click',function(e){
            e = e || window.event;
            var $tbody = $(e.target).closest('tbody');
            if($tbody.length != 0){
               vm.item = $(e.target).closest('tr').attr('data-id');
               vm.mngReset.user = vm.mngObj.Items[vm.item-1].Account;
            }
         });

         // 显示弹层
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('id');
            if('manage-lock' == _id){
               if(vm.IsSelected('未选择任何管理员','请选择要锁定的管理员',_id)){
                  $('#mng-lock').modal('show');
               }
            }else if('manage-unlock' == _id){
               if(vm.IsSelected('未选择任何管理员','请选择要解除锁定的管理员',_id)){
                  $('#mng-unlock').modal('show');
               }
            }else if('manage-set-role' == _id){
               if(vm.IsSelected('未选择任何管理员','请选择管理员',_id)){
                  $('#mng-set-role').modal('show');
               }
            }else if('manage-lock-key' == _id){
               if(vm.IsSelected('未选择任何管理员','请选择要绑定的管理员',_id)){
                  $('#mng-lock-key').modal('show');
               }
            }else if('manage-unbind-otp' == _id){
               if(vm.IsSelected('未选择任何管理员','请选择管理员',_id)){                  
                  $('#mng-unbind-otp').modal('show');
               }
            }else if('manage-reset-pwd' == _id){
               if (vm.IsSelected('未选择任何管理员','请选择管理员',_id)) {
                  $('#mng-reset-pwd').modal('show');
               }
            }
         });
      },
      data(){
         return {
            mngObj: {},
            mngAdd: {account: '',nickName: '',password: ''},
            mngReset: {user: '',pwd: '',repwd: ''},
            item: -1
         }
      },
      methods:{
         // 获取管理员列表
         mngList: function(){
            var vm = this;

            Custom.ajaxFn('/Manager/GetPageList',{
               data: {page: 1,pageSize: 10},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.mngObj = res.Data;
                     var list = vm.mngObj.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreateTime = Custom.dateTimeFormatter(list[i].CreateTime);
                        list[i].LockedTime = Custom.dateTimeFormatter(list[i].LockedTime);
                     }
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 添加管理员
         mngAdd: function(){
            var vm = this;
            Custom.ajaxFn('/Manager/Add',{
               data: {account: vm.mngAdd.account,nickName: vm.mngAdd.nickName,password: vm.mngAdd.password},
               callback: function(res){
                  if(res.IsSuccess){
                     $('#mng-add').modal('hide');
                     vm.mngAdd = {account: '',nickName: '',password: ''};
                     vm.mngList();
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 锁定
         mngLock: function(){
            var vm = this;

            Custom.ajaxFn('/Manager/UpdateLockStatus',{
               data: {id: vm.item,isLock: true},
               callback: function(res){
                  if(res.IsSuccess){
                     $('#mng-reset-pwd').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 解除锁定
         mngUnlock: function(){
            var vm = this;
         },
         // 修改密码
         mngModify: function(){
            var vm = this;

            Custom.ajaxFn('/Manager/UpdatePassword',{
               data: {id: vm.item,password: vm.mngReset.pwd},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.mngReset = {user: '',pwd: '',repwd: ''};
                     $('#mng-reset-pwd').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 选择一个管理员
         IsSelected: function(title,txt,id){
            var vm = this;
            var _class = 'my-sticky'+id;
            if(vm.item == -1){
               $.gritter.add({
                  title: title,
                  text: txt,
                  sticky: false,
                  time: 5000,
                  class_name: _class
               });
               return false;
            }else{
               return true;
            }
         }
      },
      replace: true
   }
</script>
<style lang="less">
   .content{
      .manage-btns{padding-left: 0;
         >button{float: left; margin-right: 5px;
            &:last-child{margin-right: 0;}
         } 
      }
      .dataTable-filter{padding-right: 0;
         >label{
            >span,>input{float: left;}
            >span{display: block; line-height: 30px; padding-right: 10px;}
            >input{width: 83%;}
         }
      }
      #manage-table{
         >tbody{
            >tr{
               >td{
                  &:nth-child(5){text-align: right;}
               }
            }
         }
      }
      .form-horizontal{
         >.form-group{
            &:last-child{margin-bottom: 0;}
            >.control-label{
               >span{color: #f00; padding-left: 5px;}
               &.custom-label{padding-right: 0;}
            }
         }
      }
   }
</style>