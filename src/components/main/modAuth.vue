<template>
   <div id="content" class="content">
      <h1 class="page-header">模块管理 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">模块管理</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="auth-add">添加权限</button>
                     <button class="btn btn-inverse" data-id="auth-del">删除权限</button>
                     <button class="btn btn-inverse" data-id="auth-modify">修改权限</button>
                  </div>
                  <div class="clearfix"></div>
                  <table id="auth-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>Id</th>
                           <th>名称</th>
                           <th>编码</th>
                           <th>是否可用</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.Id}}</td>
                           <td>{{item.Name}}</td>
                           <td>{{item.Code}}</td>
                           <td>{{item.IsUsable ? '可用': '不可用'}}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 新增权限 -->
      <div class="modal fade" id="auth-add">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">新增权限</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">ModuleId</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="addObj.ModuleId" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="auth-Code">编码</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="auth-Code" v-model="addObj.Code" placeholder="请输入编码" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="auth-Name">名称</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="auth-Name" v-model="addObj.Name" placeholder="请输入名称" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="auth-IsUsable">是否可用</label>
                        <div class="col-md-6">
                           <div class="checkbox">
                              <label><input type="checkbox" id="auth-IsUsable" v-model="addObj.IsUsable" /></label>
                           </div>
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="!sign" @click="authAdd()" >添加</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="sign" @click="authModify()" >修改</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 新增权限 -->

      <!-- 删除权限 -->
      <div class="modal fade" id="auth-del">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认要删除该权限吗？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">权限名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="addObj.Name" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="authDel()">删除</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 删除权限 -->
   </div>
</template>
<script>
   import Custom from '../../assets/js/custom'
   export default {
      name: 'auth',
      data(){
         return{
            addObj: {ModuleId: -1,Code: '',Name: '',IsUsable: false},
            sign: false,
            index: -1,
            items: []
         }
      },
      mounted(){
         var vm = this;

         vm.addObj.ModuleId = vm.$route.params.Id;
         vm.getAuthList();

         // 关闭重置模态框
         $("#auth-add").on("hidden.bs.modal", function() {
            if(!vm.sign){
               vm.resetInfo();
            }
         });
         Custom.selectItem('#auth-table',vm.index,function(res){
            vm.index = res;
         });

         $('.manage-btns').on('click',function(e){
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();

            var _id = $(e.target).attr('data-id');

            if('auth-add' == _id){
               vm.sign = false;
               vm.resetInfo();
               $('#auth-add').modal('show');
            }else if('auth-modify' == _id){
               vm.sign = true;
               if(vm.isSelected('提示','请选择权限模块')){

                  for(var i = 0;i<vm.items.length;i++){
                     if(vm.index == vm.items[i].Id){
                        for(var k in vm.items[i]){
                           vm.addObj[k] = JSON.parse(vm.items[i][k]);
                        }
                     }
                  }
                  $('#auth-add').modal('show');
               }
            }else if('auth-del' == _id){
               if(vm.isSelected('提示','请选择权限模块')){
                  for(var i = 0;i<vm.items.length;i++){
                     if(vm.index == vm.items[i].Id){
                        for(var k in vm.items[i]){
                           vm.addObj[k] = JSON.parse(vm.items[i][k]);
                        }
                     }
                  }
                  $('#auth-del').modal('show');
               }
            }
         });
      },
      methods: {
         // 添加权限
         authAdd: function(){
            var vm = this;
            if(isNaN(vm.addObj.Code)){
               if(!Custom.isSelected({title: '提示',txt: '请输入数值',index: -1})){
                  return true;
               }
            }
            if(vm.addObj && vm.addObj.id){
               delete vm.addObj.id;
            }
            Custom.ajaxFn('/Limit/Add',{
               data: vm.addObj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getAuthList();
                     $('#auth-add').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 修改权限
         authModify: function(){
            var vm = this;

            Custom.ajaxFn('/Limit/Update',{
               data: vm.addObj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getAuthList();
                     $('#auth-add').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 删除权限
         authDel: function(){
            var vm = this;

            Custom.ajaxFn('/Limit/Delete',{
               data: {id: vm.index},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getAuthList();
                     $('#auth-del').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取权限列表
         getAuthList: function(){
            var vm = this;

            Custom.ajaxFn('/Limit/GetPageList',{
               data: {moduleId: vm.addObj.ModuleId,page: 1,pageSize: 100},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data.Items;
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

            vm.addObj.Code = '';
            vm.addObj.Name = '';
            vm.addObj.IsUsable = false;
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