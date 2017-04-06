<template>
   <div id="content" class="content">
      <h1 class="page-header">模块管理 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">模块管理</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="mod-add">新增模块</button>
                     <button class="btn btn-inverse" data-id="mod-del">删除模块</button>
                     <button class="btn btn-inverse" data-id="mod-modify">修改模块</button>
                     <button class="btn btn-inverse" data-id="mod-auth">模块权限</button>
                  </div>
                  <div class="clearfix"></div>
                  <table id="module-table" class="table table-bordered table-box">
                     <thead>
                        <tr>
                           <th>名称</th>
                           <th>模块标识</th>
                           <th>url地址</th>
                           <th>图标</th>
                           <th>顺序</th>
                           <th>是否可用</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="list in lists" :data-id="list.Id" :data-parent="list.ParentId" :data-sign="1" :class="list.ParentId == 0 ? 'success':''">
                           <td><i class="fa fa-chevron-down" v-if="list.ParentId == 0"></i>{{list.Name}}</td>
                           <td>{{list.ModuleKey}}</td>
                           <td>{{list.ModuleUrl}}</td>
                           <td><i :class="['fa',list.Icon?list.Icon:'fa-fire']"></i></td>
                           <td>{{list.SortIndex}}</td>
                           <td>{{list.IsUsable ? '可用': '不可用'}}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 新增/修改模块 -->
      <div class="modal fade" id="mod-add">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">{{obj.sign ? '修改模块': '新增模块'}}</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="mod-name">名称</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="mod-name" v-model="addObj.Name" placeholder="请输入名称" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="mod-ModuleKey">模块标识</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="mod-ModuleKey" v-model="addObj.ModuleKey" placeholder="请输入模块标识" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="mod-ParentId">上级模块</label>
                        <div class="col-md-6">
                           <select id="mod-ParentId" class="form-control" v-model="addObj.ParentId">
                              <option :value="pid.id" v-for="pid in pids">{{pid.val}}</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="mod-ModuleUrl">url地址</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="mod-ModuleUrl" v-model="addObj.ModuleUrl" placeholder="请输入url" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="mod-Icon">模块图标</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="mod-Icon" v-model="addObj.Icon" placeholder="请输入图标标识" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="mod-SortIndex">顺序</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="mod-SortIndex" v-model="addObj.SortIndex" placeholder="请输入顺序" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="mod-IsUsable">是否可用</label>
                        <div class="col-md-6">
                           <div class="checkbox">
                              <label><input type="checkbox" id="mod-IsUsable" v-model="addObj.IsUsable" /></label>
                           </div>
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="!obj.sign" @click="modAdd()" >添加</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="obj.sign" @click="modModify()" >修改</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 新增/修改模块 -->

      <!-- 删除模块 -->
      <div class="modal fade" id="mod-del">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认要删除该模块吗？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">模块名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="addObj.Name" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="modDel()">删除</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 删除模块 -->
   </div>
</template>
<script>
   import Custom from '../../assets/js/custom'
   export default {
      name: 'moduleManage',
      data(){
         return {
            addObj: {Name: '', ModuleKey: '',ParentId: -1,ModuleUrl: '',SortIndex: '',Icon: '',IsUsable: false},
            obj: {id: -1,sign: false},
            pids: [],
            lists: []
         }
      },
      mounted(){
         var vm = this;

         vm.getModuleList();

         // 关闭重置模态框
         $("#mod-add").on("hidden.bs.modal", function() {
            vm.reset();
         });
         $('#module-table').on('click',function(e){
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();

            var $tr = $(e.target).closest('tbody>tr'),
               $trs = $(e.target).closest('tbody').find('tr'),
               $i = $tr.find('td:first-child>i'),
               _sign = $tr.attr('data-sign'),
               _id = $tr.attr('data-id'),
               _pid = $tr.attr('data-parent'),k = '';

            if($tr.length != 0){
               if(0 == _pid && e.target == $i.get(0)){
                  if(1 == _sign){
                     $i.removeClass('fa-chevron-down').addClass('fa-chevron-up');
                     $trs.each(function(){
                        k = $(this).attr('data-parent');
                        if(_id == k){
                           $(this).addClass('hide');
                        }
                     });
                     $tr.attr('data-sign',0);
                  }else{
                     $i.removeClass('fa-chevron-up').addClass('fa-chevron-down');
                     $trs.each(function(){
                        k = $(this).attr('data-parent');
                        if(_id == k){
                           $(this).removeClass('hide');
                        }
                     });
                     $tr.attr('data-sign',1);
                  }
               }
               //if(0 != _pid && e.target != $i.get(0)){
                  if(vm.obj.id == _id){
                     vm.obj.id = -1;
                     $trs.removeClass('warning');
                  }else{
                     vm.obj.id = _id;
                     $tr.addClass('warning').siblings('tr').removeClass('warning');
                  }
               //}
            }
         });

         $('.manage-btns').on('click',function(e){
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择权限模块";
            if(('mod-modify' == _id)||('mod-del' == _id)){
               for(var i = 0;i<vm.lists.length;i++){
                  if(vm.obj.id == vm.lists[i].Id){
                     for(var k in vm.lists[i]){
                        vm.addObj[k] = vm.lists[i][k];
                     }
                  }
               }
            }
            if('mod-add' == _id){
               vm.obj.sign = false;
               $('#mod-add').modal('show');
            }else if('mod-modify' == _id){
               vm.obj.sign = true;
               if(vm.isSelected(title,info)){
                  $('#mod-add').modal('show');
               }
            }else if('mod-del' == _id){
               if(vm.isSelected(title,info)){
                  $('#mod-del').modal('show');
               }
            }else if('mod-auth' == _id){
               if(vm.isSelected(title,info)){
                  vm.$router.push({name: 'modAuth',params:{Id: vm.obj.id}});
               }
            }
         });
      },
      methods: {
         // 添加模块
         modAdd: function(){
            var vm = this;
            if(vm.addObj && vm.addObj.Id){
               delete vm.addObj.Id;
            }
            //console.log(vm.addObj);
            Custom.ajaxFn('/Module/Add',{
               data: vm.addObj,
               vm: vm,
               callback: function(res){
                  var msg = '';
                  if(res.IsSuccess){
                     vm.reset();
                     vm.getModuleList();
                     $('#mod-add').modal('hide');
                     msg = '添加成功！';
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
         // 修改模块
         modModify: function(){
            var vm = this;
            console.log(vm.addObj);
            Custom.ajaxFn('/Module/Update',{
               data: vm.addObj,
               vm: vm,
               callback: function(res){
                  var msg = '';
                  if(res.IsSuccess){
                     vm.getModuleList();
                     $('#mod-add').modal('hide');
                     msg = '修改成功！';
                  }else{
                     msg = '修改失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 删除模块
         modDel: function(){
            var vm = this;
            Custom.ajaxFn('/Module/Delete',{
               data: {Id: vm.obj.id},
               vm: vm,
               callback: function(res){
                  var msg = '';
                  if(res.IsSuccess){
                     $('#mod-del').modal('hide');
                     vm.getModuleList();
                     msg = '删除成功！';
                  }else{
                     msg = '删除失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取模块列表
         getModuleList: function(){
            var vm = this;

            Custom.ajaxFn('/Module/GetPageList',{
               data: {page: 1,pageSize: 100},
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items,_tmp = {},_tmp2 = {},finalList = [];
                     vm.pids = [];
                     for(var i = 0;i<list.length;i++){
                        if(0==list[i].ParentId){
                           vm.pids.push({id: list[i].Id,val: list[i].Name});
                        }
                        if(0 == list[i].ParentId){
                           if(_tmp['0']){
                              _tmp['0'].push(list[i]);
                           }else{
                              _tmp['0'] = [];
                              _tmp['0'].push(list[i]);
                           }
                        }
                        for(var j= 0;j<list.length;j++){
                           if(list[i].Id == list[j].ParentId){
                              if(_tmp2[list[i].Id]){
                                 _tmp2[list[i].Id].push(list[j]);
                              }else{
                                 _tmp2[list[i].Id] = [];
                                 _tmp2[list[i].Id].push(list[j]);
                              }
                           }
                        }
                     }

                     for(var m in _tmp[0]){
                        _tmp[0].sort(function(a,b){ return a.SortIndex -b.SortIndex; });
                        var a = _tmp[0];
                        finalList.push(a[m]);
                        
                        for(var n in _tmp2){
                           _tmp2[n].sort(function(a,b){ return a.SortIndex -b.SortIndex; });
                           for(var l = 0;l<_tmp2[n].length;l++){
                              var k = _tmp2[n];
                              if(a[m].Id == k[l].ParentId){
                                 finalList.push(k[l]);
                              }
                              
                           }
                        }
                     }
                     //console.log(finalList);
                     vm.pids.unshift({id: 0,val: '根模块'});
                     
                     vm.addObj.ParentId = vm.pids[0].id;
                     vm.lists = finalList;
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         reset: function(){
            var vm = this;
            vm.addObj = {Name: '', ModuleKey: '',ParentId: vm.pids[0].id,ModuleUrl: '',SortIndex: '',Icon: '',IsUsable: false};
         },
         // 请选择一个模块
         isSelected: function(title,txt){
            var vm = this;
            return Custom.isSelected({title: title,txt: txt,index: vm.obj.id});
         }
      },
      replace: true
   }
</script>
<style lang="less">
   #module-table{
      >tbody{
         >tr{cursor: pointer;
            &.hide{display: none;}
            >td{
               >i{margin-right: 5px;}
            }
         }
      }
   }
</style>