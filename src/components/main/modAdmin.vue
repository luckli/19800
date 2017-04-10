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
                     <button class="btn btn-inverse" id="manage-setRole">分配管理角色</button>
                     <button class="btn btn-inverse" id="manage-viewTF">查看谷歌秘钥</button>
                     <button class="btn btn-inverse" id="manage-resetPwd">重置登陆密码</button>
                     <button class="btn btn-inverse" id="manage-depositCodeAuth">充值码授权</button>
                     <button class="btn btn-inverse" id="manage-unbindOtp">解除谷歌otp绑定</button>
                  </div>
                  <div class="col-xs-4 col-md-4 dataTable-filter text-right">
                     <label for="input-filter">
                        <span>搜索</span>
                        <input type="text" class="form-control input-sm" v-model="search.realName" @keyup.enter="mngList()" placeholder="输入登陆账号进行搜索..." />
                     </label>
                  </div>
                  <div class="clearfix"></div>
                  <table id="manage-table" class="table table-striped table-bordered table-box">
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
                           <td><span :class="item.IsLocked ? 'cRed' : ''">{{item.IsLocked ? "已锁定": "No"}}</span></td>
                           <td>{{item.RoleNames}}</td>
                           <td>{{item.DepositAmount}}</td>
                           <td>{{item.CreateTime}}</td>
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
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="mngAddFn()" @keyup.enter="mngAddFn()">保存</a>
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
                           <input type="text" class="form-control" name="lock-user" v-model="mngReset.user" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="mngLock()">锁定</a>
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
                           <input type="text" class="form-control" name="unlock-user" v-model="mngReset.user" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="mngUnlock()">解锁</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 解除锁定 -->

      <!-- 分配管理角色 -->
      <div class="modal fade" id="mng-setRole">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">分配管理角色</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" name="set-user" v-model="mngReset.user" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">角色<span>*</span></label>
                        <div class="col-md-6">
                           <ul class="list-role">
                              <li v-for="role in roleList"><label><input type="checkbox" name="roles" :data-id="role.id" /><span>{{role.roleName}}</span></label></li>
                           </ul>
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="mngSetRole()">锁定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 分配管理角色 -->
      
      <!-- 充值额度授权 -->
      <div class="modal fade" id="mng-depositCodeAuth">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">充值额度授权</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="key-user">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="key-user" v-model="mngReset.user" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="authAmount">额度<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="authAmount" v-model="authAmount" placeholder="请输入授权额度" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="mngDepositCodeAuth()">添加</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 充值额度授权 -->

      <!-- 查看谷歌秘钥  -->
      <div class="modal fade" id="mng-viewTF">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">查看谷歌秘钥</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="key-user">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="key-user" v-model="mngReset.user" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="key-TF-KEY">TF-KEY</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="key-TF-KEY" v-model="gugObj.TF" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label scanning">扫一扫</label>
                        <div class="col-md-6">
                           <p id="qrcode"></p>
                        </div>
                     </div>
                     <div class="form-group" v-show="!gugObj.isBind">
                        <label class="col-md-4 control-label custom-label" for="key-code">code</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="key-code" v-model="gugObj.optCode" />
                        </div>
                        <div class="col-md-2" style="padding-left: 0;">
                           <a href="javascript:;" class="btn btn-success" @click="mngBindOtp()">绑定</a>
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 查看谷歌秘钥 -->

      <!-- 解除谷歌otp绑定 -->
      <div class="modal fade" id="mng-unbindOtp">
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
                           <input type="text" class="form-control" name="opt-user" v-model="mngReset.user" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="mngUnbindOtp()">解除</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 解除谷歌otp绑定 -->

      <!-- 重置登陆密码  -->
      <div class="modal fade" id="mng-resetPwd">
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
   import '../../assets/lib/jquery.gritter'
   import '../../assets/lib/jquery.qrcode'
   import Custom from 'custom'
   import Page from 'page'
   export default {
      name: 'adminList',
      mounted(){
         var vm = this;
         vm.mngList();

         /*选定管理员*/
         /*$('#manage-table').on('click',function(e){
            e = e || window.event;
            var $tbody = $(e.target).closest('tbody'),
               $tr = $(e.target).closest('tr');
            if($tbody.length != 0){

               if($tr.hasClass('warning')){
                  $tr.removeClass('warning');
                  vm.item = -1;
               }else{
                  $tr.addClass('warning').siblings('tr').removeClass('warning');
                  vm.item = $tr.attr('data-id');
                  vm.mngReset.user = vm.mngObj.Items[vm.item-1].Account;
               }
            }
         });*/

         // 显示弹层
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('id');
            if('manage-lock' == _id){
               if(vm.IsSelected('未选择任何管理员','请选择要锁定的管理员')){
                  $('#mng-lock').modal('show');
               }
            }else if('manage-unlock' == _id){
               if(vm.IsSelected('未选择任何管理员','请选择要解除锁定的管理员')){
                  $('#mng-unlock').modal('show');
               }
            }else if('manage-setRole' == _id){
               if(vm.IsSelected('未选择任何管理员','请选择管理员')){
                  vm.getRoles();
                  $('#mng-setRole').modal('show');
               }
            }else if('manage-depositCodeAuth' == _id){
               if(vm.IsSelected('未选择任何管理员','请选择管理员')){
                  $('#mng-depositCodeAuth').modal('show');
               }
            }else if('manage-viewTF' == _id){
               if(vm.IsSelected('未选择任何管理员','请选择管理员')){
                  vm.getGoogleKey();
                  $('#mng-viewTF').modal('show');
               }
            }else if('manage-unbindOtp' == _id){
               if(vm.IsSelected('未选择任何管理员','请选择管理员')){
                  $('#mng-unbindOtp').modal('show');
               }
            }else if('manage-resetPwd' == _id){
               if (vm.IsSelected('未选择任何管理员','请选择管理员')) {
                  $('#mng-resetPwd').modal('show');
               }
            }
         });

         Custom.selectItem('#manage-table',vm.item,function(res){
            vm.item = res;
            vm.mngReset.user = vm.mngObj.Items[vm.item-1].Account;
         });
      },
      data(){
         return {
            mngObj: {},
            mngAdd: {account: '',nickName: '',password: ''},
            mngReset: {user: '',pwd: '',repwd: ''},
            item: -1,
            isLock: false,
            authAmount: '',
            gugObj: {optCode: '',TF: '加载中...',isBind: true},
            roleList: [],
            total: 0,
            totalItems: 0,
            search: {realName: '',page: 1,pageSize: 10}
         }
      },
      methods:{
         // 获取管理员列表
         mngList: function(){
            var vm = this;

            Custom.ajaxFn('/Manager/GetPageList',{
               data: vm.search,
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreateTime = Custom.dateTimeFormatter(list[i].CreateTime);
                        list[i].LockedTime = Custom.dateTimeFormatter(list[i].LockedTime);
                     }
                     vm.mngObj.Items = list;

                     vm.total = res.Data.TotalPage;
                     vm.search.page = res.Data.CurrentPage;
                     vm.totalItems = res.Data.TotalItems;
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 添加管理员
         mngAddFn: function(){
            var vm = this;
            Custom.ajaxFn('/Manager/Add',{
               data: {account: vm.mngAdd.account,nickName: vm.mngAdd.nickName,password: vm.mngAdd.password},
               vm: vm,                     
               callback: function(res){
                  var msg = '添加成功！';
                  if(res.IsSuccess){
                     $('#mng-add').modal('hide');
                     vm.mngAdd = {account: '',nickName: '',password: ''};
                     vm.mngList();
                  }else{
                     msg = '添加失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 锁定
         mngLock: function(){
            var vm = this;

            vm.isLock = true;
            Custom.ajaxFn('/Manager/UpdateLockStatus',{
               data: {id: vm.item,isLock: vm.isLock},
               vm: vm,
               callback: function(res){
                  var msg = '锁定成功！';
                  if(res.IsSuccess){
                     vm.mngObj.Items[vm.item-1].IsLocked = vm.isLock;
                     $('#mng-lock').modal('hide');
                  }else{
                     msg = '锁定失败！'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 解除锁定
         mngUnlock: function(){
            var vm = this;

            vm.isLock = false;
            Custom.ajaxFn('/Manager/UpdateLockStatus',{
               data: {id: vm.item,isLock: vm.isLock},
               vm: vm,
               callback: function(res){
                  var msg = '解锁成功！';
                  if(res.IsSuccess){
                     vm.mngObj.Items[vm.item-1].IsLocked = vm.isLock;
                     $('#mng-unlock').modal('hide');
                  }else{
                     msg = '解锁失败！'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 分配管理角色
         mngSetRole: function(){
            var vm = this,
               $list = $('input[name="roles"]:checked'),
               ids = [];

            $list.each(function(){
               ids.push($(this).attr('data-id'));
            });

            Custom.ajaxFn('/Manager/SetRoles',{
               data: {id: vm.item,roles: ids.join(',')},
               vm: vm,
               callback: function(res){
                  var msg = '分配成功！';
                  if(res.IsSuccess){
                     $('#mng-setRole').modal('hide');
                  }else{
                     msg = '分配失败！'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 修改密码
         mngModify: function(){
            var vm = this;

            Custom.ajaxFn('/Manager/UpdatePassword',{
               data: {id: vm.item,password: vm.mngReset.pwd},
               vm: vm,
               callback: function(res){
                  var msg = '修改成功！';
                  if(res.IsSuccess){
                     vm.mngReset = {user: '',pwd: '',repwd: ''};
                     $('#mng-resetPwd').modal('hide');
                  }else{
                     msg = '修改失败！'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 充值额度授权
         mngDepositCodeAuth: function(){
            var vm = this;

            if(isNaN(vm.authAmount)){
               return false;
            }
            Custom.ajaxFn('/Manager/AddDepositAmount',{
               data: {id: vm.item,amount: vm.authAmount},
               vm: vm,
               callback: function(res){
                  var msg = '授权成功！';
                  if(res.IsSuccess){
                     vm.authAmount = '';
                     vm.mngObj.Items[vm.item-1].DepositAmount = res.Data;
                     $('#mng-depositCodeAuth').modal('hide');
                  }else{
                     msg = '授权失败！'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 绑定谷歌otp
         mngBindOtp: function(){
            var vm = this;
            
            Custom.ajaxFn('/Manager/BindOtp',{
               data: {id: vm.item,code: vm.gugObj.optCode},
               vm: vm,
               callback: function(res){
                  var msg = '绑定成功！';
                  if(res.IsSuccess){
                     vm.gugObj = {optCode: '',TF: '加载中...',isBind: false};
                     $('#mng-viewTF').modal('hide');
                  }else{
                     msg = '绑定失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 解除谷歌otp绑定
         mngUnbindOtp: function(){
            var vm = this;
            
            Custom.ajaxFn('/Manager/UnBindOtp',{
               data: {id: vm.item},
               vm: vm,
               callback: function(res){
                  var msg = '解除成功！';
                  if(res.IsSuccess){
                     $('#mng-unbindOtp').modal('hide');
                  }else{
                     msg = '解除失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取谷歌密钥
         getGoogleKey: function(){
            var vm = this;
            vm.gugObj.TF = '加载中...';
            Custom.ajaxFn('/Manager/GetOtpSecretKey',{
               data: {id: vm.item},
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.gugObj.TF = res.Data.SecretKey;
                     $('#qrcode>canvas').remove();
                     $('#qrcode').qrcode({width:100,height:100,correctLevel:0,text: 'otpauth://totp/'+vm.mngReset.user+'?secret='+res.Data.SecretKey});
                     vm.gugObj.isBind = res.Data.IsBind;
                  }else{
                     vm.gugObj.TF = '获取失败！';
                  }
               },
               errorCallback: function(res){
                  vm.gugObj.TF = '加载出错，请稍后重试！';
               }
            });
         },
         // 获取角色列表
         getRoles: function(){
            var vm = this;

            vm.roleList = [
               {id: 1,roleName: 'FinancialStaff'},
               {id: 2,roleName: 'FinancialManager'},
               {id: 3,roleName: 'CustomerService'},
               {id: 4,roleName: 'Editor'}];
         },
         pageFn: function(index){
            var vm = this;
            vm.search.page = index;
            vm.mngList();
         },
         // 请选择一个管理员
         IsSelected: function(title,txt){
            var vm = this;
            /*var _class = 'my-sticky'+id;
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
            }*/
            return Custom.isSelected({title: title,txt: txt,index: vm.item});
         }
      },
      components:{
         Page
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
         >label{ margin-bottom: 0;
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
                  >.cRed{color: #f00;}
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