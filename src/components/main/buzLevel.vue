<template>
   <div id="content" class="content">
      <h1 class="page-header">实名认证等级管理 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">实名认证等级管理</h4></div>
               <div class="panel-body">
                  <div class="col-xs-4 col-md-4 manage-btns">
                     <button class="btn btn-inverse" data-id="buz-add">新增</button>
                     <button class="btn btn-inverse" data-id="buz-modify">修改</button>
                     <button class="btn btn-inverse" data-id="buz-del">删除</button>
                  </div>
                  <div class="clearfix"></div>
                  <table id="vLevel-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>编号</th>
                           <th>验证等级</th>
                           <th>日限额</th>
                           <th>月限额</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.Id}}</td>
                           <td>{{item.VerifyLevel}}</td>
                           <td>{{item.DayAmount}}</td>
                           <td>{{item.MonthAount}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="4" style="text-align: center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 新增/修改 -->
      <div class="modal fade" id="mod-operate">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-if="1==sign">新增</span><span v-if="2==sign">修改</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group" v-if="2==sign">
                        <label class="col-md-4 control-label custom-label">编号</label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" v-model="item" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">验证等级<span>*</span></label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" v-model="obj.VerifyLevel" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">日限额<span>*</span></label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" v-model="obj.DayAmount" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">日限额<span>*</span></label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" v-model="obj.MonthAount" />
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
      <!-- 新增/修改 -->

      <!-- 删除 -->
      <div class="modal fade" id="mod-del">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认删除该记录吗？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">编号</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="item" readonly />
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
      name: 'validate-level',
      data(){
         return {
            items: [],
            item: -1,
            sign: 1,
            obj: {VerifyLevel: 0,DayAmount: 0,MonthAount: 0},
            search: {page: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         vm.getPageList();

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个等级记录";
            if('buz-add' == _id){
               vm.sign = 1;
               $('#mod-operate').modal('show');
            }else if('buz-modify' == _id){
               vm.sign = 2;
               if(vm.IsSelected(title,info)){
                  $('#mod-operate').modal('show');
               }
            }else if('buz-del' == _id){
               if(vm.IsSelected(title,info)){
                  $('#mod-del').modal('show');
               }
            }
         });

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            if(1==vm.sign){
               vm.obj = {VerifyLevel: 0,DayAmount: 0,MonthAount: 0};
            }
         });

         Custom.selectItem('#vLevel-table',vm.item,function(res){
            vm.item = res;
            for(var i = 0;i<vm.items.length;i++){
               if(res == vm.items[i].Id){
                  vm.obj.Id = vm.items[i].Id;
                  vm.obj.VerifyLevel = vm.items[i].VerifyLevel;
                  vm.obj.DayAmount = vm.items[i].DayAmount;
                  vm.obj.MonthAount = vm.items[i].MonthAount;
               }
            }
         });
      },
      methods:{
         // 新增/修改
         toOperate: function(){
            var vm = this,url="/Withdrawallimit/Add";
            if(1==vm.sign){
               url="/Withdrawallimit/Add";
               if(vm.obj.Id){
                  delete vm.obj.Id;
               }
            }else if(2==vm.sign){
               vm.obj.Id = vm.item;
               url="/Withdrawallimit/Update";
            }
            Custom.ajaxFn(url,{
               data: vm.obj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                     $('#mod-operate').modal('hide');
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 删除
         toDel: function(){
            var vm = this;

            Custom.ajaxFn('/Withdrawallimit/Delete',{
               data: {id: vm.item},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                     $('#mod-del').modal('hide');
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取等级列表
         getPageList: function(){
            var vm = this;
            Custom.ajaxFn('/Withdrawallimit/GetPageList',{
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data.Items;
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
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