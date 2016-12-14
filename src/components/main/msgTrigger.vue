<template>
   <div id="content" class="content">
      <h1 class="page-header">Notification触发器管理 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">Notification触发器管理</h4></div>
               <div class="panel-body">
                  <div class="col-xs-4 col-md-4 manage-btns">
                     <button class="btn btn-inverse" id="trigger-add">新增</button>
                     <button class="btn btn-inverse" id="trigger-modify">修改</button>
                     <button class="btn btn-inverse" id="trigger-del">删除</button>
                     <button class="btn btn-inverse" id="trigger-module">模板管理</button>
                  </div>
                  <div class="col-xs-8 col-md-8 form-inline text-right">
                     <div class="form-group">
                        <input type="text" class="form-control input-sm" v-model="search.queryText" @keyup.enter="getPageList()" placeholder="输入email进行搜索..." />
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="trigger-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>编号</th>
                           <th>唯一码</th>
                           <th>名称</th>
                           <th>模板标签</th>
                           <th>是否可用</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.Id}}</td>
                           <td>{{item.Key}}</td>
                           <td>{{item.Name}}</td>
                           <td>{{item.Props}}</td>
                           <td><span v-if="item.IsUsable">可用</span><span v-else>不可用</span></td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="5" style="text-align: center;">无数据</td>
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
                        <label class="col-md-4 control-label custom-label" for="obj_key">唯一码</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="obj_key" v-model="obj.Key" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="obj_name">名称</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="obj_name" v-model="obj.Name" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="obj_props">模板标签</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="obj_props" v-model="obj.Props" />
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
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toOperate()">确定</a>
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
            search: {page: 1,pageSize: 10,queryText: ''},
            obj: {Key: '',Name: '',Props: '',IsUsable: true},
            item: -1,
            sign: 1
         }
      },
      mounted(){
         var vm = this;

         vm.getPageList();
         // 显示弹层
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('id'),title="提示",info = "请选择一个触发器";
            if('trigger-add' == _id){
               vm.sign = 1;
               $('#trg-operate').modal('show');
            }else if('trigger-modify' == _id){
               vm.sign = 2;
               if(vm.IsSelected(title,info)){
                  for(var i = 0;i<vm.items.length;i++){
                     if(vm.item == vm.items[i].Id){
                        vm.obj.Key = vm.items[i].Key;
                        vm.obj.Name = vm.items[i].Name;
                        vm.obj.Props = vm.items[i].Props;
                        vm.obj.IsUsable = vm.items[i].IsUsable;
                        vm.obj.Id = vm.items[i].Id;
                     }
                  }
                  $('#trg-operate').modal('show');
               }
            }else if('trigger-del' == _id){
               if(vm.IsSelected(title,info)){
                  $('#trg-del').modal('show');
               }
            }else if('trigger-module' == _id){
               if(vm.IsSelected(title,info)){
                  vm.$router.push({name: 'msgModule',params:{Id: vm.item}});
               }
            }
         });
         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            if(1==vm.sign){
               vm.obj = {Key: '',Name: '',Props: '',IsUsable: true};
            }
         });

         Custom.selectItem('#trigger-table',vm.item,function(res){
            vm.item = res;
         });
      },
      methods:{
         // 新增/修改
         toOperate: function(){
            var vm = this,url = '/NoticeTrigger/Add';
            if(1==vm.sign){
               url = '/NoticeTrigger/Add';
               if(vm.obj.Id){
                  delete vm.obj.Id;
               }
            }else if(2==vm.sign){
               url = '/NoticeTrigger/Update';
            }

            Custom.ajaxFn(url,{
               data: vm.obj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: res,index: -1});
                  }
                  $('#trg-operate').modal('hide');
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 删除
         toDel: function(){
            var vm = this;

            Custom.ajaxFn('/NoticeTrigger/Delete',{
               data: {Id: vm.item},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: res,index: -1});
                  }
                  $('#trg-del').modal('hide');
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取触发器列表
         getPageList: function(){
            var vm = this;

            Custom.ajaxFn('/NoticeTrigger/GetPageList',{
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data.Items;
                  }else{
                     vm.items = [];
                     Custom.isSelected({title: '提示',txt: res,index: -1});
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