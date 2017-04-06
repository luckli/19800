<template>
   <div id="content" class="content">
      <h1 class="page-header">Notification模块管理 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">Notification模块管理</h4></div>
               <div class="panel-body">
                  <div class="col-xs-4 col-md-4 manage-btns">
                     <button class="btn btn-inverse" id="mods-add">新增</button>
                     <button class="btn btn-inverse" id="mods-modify">修改</button>
                     <button class="btn btn-inverse" id="mods-del">删除</button>
                  </div>
                  <div class="clearfix"></div>
                  <table id="trigger-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>编号</th>
                           <th>触发器编号</th>
                           <th>标题</th>
                           <th>邮件内容</th>
                           <th>短信内容</th>
                           <th>APP推送内容</th>
                           <th>语言</th>
                           <th>是否可用</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.Id}}</td>
                           <td>{{item.TriggerId}}</td>
                           <td>{{item.Title}}</td>
                           <td>{{item.Email}}</td>
                           <td>{{item.Sms}}</td>
                           <td>{{item.App}}</td>
                           <td><span v-if="0==item.LangType">CN</span><span v-if="1==item.LangType">EN</span></td>
                           <td><span v-if="item.IsUsable">可用</span><span v-else>不可用</span></td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="8" style="text-align: center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 新增/修改 -->
      <div class="modal fade" id="trg-operate">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-if="1==sign">新增</span><span v-if="2==sign">修改</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="obj_num">触发器编号</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="obj_num" v-model="obj.TriggerId" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="obj_name">标题</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="obj_name" v-model="obj.Title" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="obj_props">邮件内容</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="obj_props" v-model="obj.Email" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="obj_sms">短信内容</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="obj_sms" v-model="obj.Sms" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="obj_app">APP推送内容</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="obj_app" v-model="obj.App" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="obj_type">语言</label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" id="obj_type" v-model="obj.LangType" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">是否可用</label>
                        <div class="col-md-6">
                           <input type="checkbox" v-model="obj.IsUsable" />
                        </div
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toOperate()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 新增/修改 -->

      <!-- 删除 -->
      <div class="modal fade" id="trg-del">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认要删除该触发器吗？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="obj_key">编号</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="obj_key" v-model="item" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toDel()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 删除 -->
   </div>
</template>
<script>
   import Custom from 'custom'
   export default{
      name: 'trigger',
      data(){
         return{
            items: [],
            triggers: [],
            search: {page: 1,pageSize: 10,triggerId: ''},
            obj: {TriggerId: '',Title: '',Email: '',Sms: '',App: '',LangType: 0,IsUsable: true},
            item: -1,
            sign: 1
         }
      },
      mounted(){
         var vm = this;
         var triggerId = vm.$route.params.Id;
         vm.search.triggerId = triggerId;
         vm.obj.TriggerId = triggerId;
         vm.getPageList();
         // 显示弹层
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('id'),title="提示",info = "请选择一个触发器";
            if('mods-add' == _id){
               vm.sign = 1;
               $('#trg-operate').modal('show');
            }else if('mods-modify' == _id){
               vm.sign = 2;
               if(vm.IsSelected(title,info)){
                  for(var i = 0;i<vm.items.length;i++){
                     if(vm.item == vm.items[i].Id){
                        vm.obj.TriggerId = vm.items[i].TriggerId;
                        vm.obj.Title = vm.items[i].Title;
                        vm.obj.Email = vm.items[i].Email;
                        vm.obj.Sms = vm.items[i].Sms;
                        vm.obj.App = vm.items[i].App;
                        vm.obj.LangType = vm.items[i].LangType;
                        vm.obj.IsUsable = vm.items[i].IsUsable;
                        vm.obj.Id = vm.items[i].Id;
                     }
                  }
                  $('#trg-operate').modal('show');
               }
            }else if('mods-del' == _id){
               if(vm.IsSelected(title,info)){
                  $('#trg-del').modal('show');
               }
            }
         });
         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            if(1==vm.sign){
               vm.obj = {TriggerId: triggerId,Title: '',Email: '',Sms: '',App: '',LangType: 0,IsUsable: true};
            }
         });

         Custom.selectItem('#trigger-table',vm.item,function(res){
            vm.item = res;
         });
      },
      methods:{
         // 新增/修改
         toOperate: function(){
            var vm = this,url = '/NoticeTpl/Add';
            if(1==vm.sign){
               url = '/NoticeTpl/Add';
               if(vm.obj.Id){
                  delete vm.obj.Id;
               }
            }else if(2==vm.sign){
               url = '/NoticeTpl/Update';
            }

            Custom.ajaxFn(url,{
               data: vm.obj,
               vm: vm,
               callback: function(res){
                  var msg = '新增成功！';
                  if(2==vm.sign){
                     msg = '修改成功！';
                  }
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     msg = '新增失败，'+res.ErrorMsg;
                     if(2==vm.sign){
                        msg = '修改失败，'+res.ErrorMsg;
                     }
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
                  $('#trg-operate').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 删除
         toDel: function(){
            var vm = this;

            Custom.ajaxFn('/NoticeTpl/Delete',{
               data: {Id: vm.item},
               vm: vm,
               callback: function(res){
                  var msg = '删除成功！';
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     msg = '删除失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
                  $('#trg-del').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取模块列表
         getPageList: function(){
            var vm = this;

            Custom.ajaxFn('/NoticeTpl/GetPageList',{
               data: vm.search,
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data.Items;
                  }else{
                     vm.items = [];
                     Custom.isSelected({title: '提示',txt: res,index: -1});
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
         }
      },
      replace: true
   }
</script>