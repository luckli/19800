<template>
   <div id="content" class="content">
      <h1 class="page-header">角色管理 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">角色管理</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="role-add">添加角色</button>
                     <button class="btn btn-inverse" data-id="role-modify">修改角色</button>
                     <button class="btn btn-inverse" data-id="role-setRoleAuth">分配角色权限</button>
                  </div>
                  <div class="clearfix"></div>
                  <table id="role-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>Id</th>
                           <th>名称</th>
                           <th>是否可用</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="role in roles" :data-id="role.Id">
                           <td>{{role.Id}}</td>
                           <td>{{role.Name}}</td>
                           <td>{{role.IsUsable ? '可用': '不可用'}}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 新增/更新角色 -->
      <div class="modal fade" id="role-add">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">{{sign ? '更新角色': '新增角色'}}</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="role-Name">名称</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="role-Name" v-model="roleObj.Name" placeholder="请输入名称" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="role-IsUsable">是否可用</label>
                        <div class="col-md-6">
                           <div class="checkbox">
                              <label><input type="checkbox" id="role-IsUsable" v-model="roleObj.IsUsable" /></label>
                           </div>
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="!sign" @click="roleAdd()" >添加</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="sign" @click="roleModify()" >更新</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 新增/更新角色 -->
   </div>
</template>
<script>
   import Custom from '../../assets/js/custom'
   export default {
      name: 'role',
      data(){
         return {
            roles: [],
            index: -1,
            roleObj: {Name: '',IsUsable: false},
            sign: false
         }
      },
      mounted(){
         var vm = this;

         vm.getRoleList();

         Custom.selectItem('#role-table',vm.index,function(res){
            vm.index = res;
         });
         // 关闭重置模态框
         $("#role-add").on("hidden.bs.modal", function() {
            vm.resetInfo();
         });
         // 按钮事件
         $('.manage-btns').on('click',function(e){
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();

            var _id = $(e.target).attr('data-id');

            if('role-add' == _id){
               vm.sign = false;
               $('#role-add').modal('show');
            }else if('role-modify' == _id){
               if(vm.isSelected('提示','请选择角色')){
                  vm.sign = true;
                  for(var i = 0;i<vm.roles.length;i++){
                     if(vm.index == vm.roles[i].Id){
                        for(var k in vm.roles[i]){
                           vm.roleObj[k] = JSON.parse(vm.roles[i][k]);
                        }
                     }
                  }
                  $('#role-add').modal('show');
               }
            }else if('role-setRoleAuth' == _id){
               if(vm.isSelected('提示','请选择角色')){
                  vm.$router.push({name: 'modRoleAuth',params: {Id: vm.index}});
               }
            }
         });
      },
      methods: {
         // 获取列表
         getRoleList: function(){
            var vm = this;

            Custom.ajaxFn('/Role/GetPageList',{
               data: {page: 1,pageSize: 100},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.roles = res.Data.Items;
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 新增角色
         roleAdd: function(){
            var vm = this;

            if(vm.roleObj && vm.roleObj.Id){
               delete vm.roleObj.Id;
            }
            Custom.ajaxFn('/Role/Add',{
               data: vm.roleObj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getRoleList();
                     $('#role-add').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 修改角色
         roleModify: function(){
            var vm = this;

            Custom.ajaxFn('/Role/Update',{
               data: vm.roleObj,
               callback: function(res){
                  if(res.IsSuccess){
                     for(var i = 0;i<vm.roles.length;i++){
                        if(vm.index == vm.roles[i].Id){
                           for(var k in vm.roles[i]){
                              vm.roles[i][k] = vm.roleObj[k];
                           }
                        }
                     }
                     $('#role-add').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 重置信息
         resetInfo: function(){
            var vm = this;

            vm.roleObj.Name = '';
            vm.roleObj.IsUsable = false;
         },
         // 请选择一个模块
         isSelected: function(title,txt){
            var vm = this;
            return Custom.isSelected({title: title,txt: txt,index: vm.index});
         }
      },
      replace: true
   }
</script>