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
                  </div>
                  <div class="clearfix"></div>
                  <table id="module-table" class="table table-striped table-bordered">
                     <thead>
                        <tr>
                           <th>名称</th>
                           <th>模块标识</th>
                           <th>上级ID</th>
                           <th>url地址</th>
                           <th>图标</th>
                           <th>顺序</th>
                           <th>是否可用</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr data-id="1" data-sign="1">
                           <td><i class="fa fa-chevron-down"></i>模块1</td>
                           <td>模块标识1</td>
                           <td>1</td>
                           <td>http://www.baidu.com</td>
                           <td><i class="fa fa-fire"></i></td>
                           <td>1</td>
                           <td>可用</td>
                        </tr>
                        <tr data-id="1-1">
                           <td>模块1-1</td>
                           <td>模块标识1-1</td>
                           <td>1-1</td>
                           <td>http://www.baidu.com</td>
                           <td><i class="fa fa-fire"></i></td>
                           <td>1-1</td>
                           <td>可用</td>
                        </tr>
                        <tr data-id="2" data-sign="1">
                           <td><i class="fa fa-chevron-down"></i>模块2</td>
                           <td>模块标识2</td>
                           <td>2</td>
                           <td>http://www.baidu.com</td>
                           <td><i class="fa fa-fire"></i></td>
                           <td>2</td>
                           <td>可用</td>
                        </tr>
                        <tr data-id="2-2">
                           <td>子模块2-2</td>
                           <td>子模块标识2-2</td>
                           <td>子2-2</td>
                           <td>子http://www.baidu.com</td>
                           <td><i class="fa fa-fire"></i></td>
                           <td>子2-2</td>
                           <td>子可用</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 新增模块 -->
      <div class="modal fade" id="mod-add">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">新增模块</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="mod-name">名称</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="mod-name" v-model="modAdd.name" placeholder="请输入名称" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="mod-sign">模块标识</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="mod-sign" v-model="modAdd.sign" placeholder="请输入模块标识" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="mod-parent">上级ID</label>
                        <div class="col-md-6">
                           <select id="mod-parent" v-model="modAdd.parent">
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="mod-url">url地址</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="mod-url" v-model="modAdd.url" placeholder="请输入url" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="mod-sort">顺序</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="mod-sort" v-model="modAdd.sort" placeholder="请输入顺序" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="mod-enable">是否可用</label>
                        <div class="col-md-6">
                           <input type="checkbox" class="form-control" id="mod-enable" v-model="modAdd.enable" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="">添加</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 新增模块 -->
   </div>
</template>
<script>
   export default {
      name: 'moduleManage',
      data(){
         return {
            modAdd: {name: '', sign: ''},
            list: []
         }
      },
      mounted(){
         $('#module-table').on('click',function(e){
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();

            var $tr = $(e.target).closest('tbody>tr'),
               $trs = $(e.target).closest('tbody').find('tr'),
               $i = $(e.target).closest('tr').find('td:first-child>i'),
               _sign = $tr.attr('data-sign'),
               _id = $tr.attr('data-id'),k = '';
            
            if($tr.length != 0){
               if($tr.length > 0 && _id.indexOf('-') == -1){
                  if('0' == _sign){
                     $i.removeClass('fa-chevron-up').addClass('fa-chevron-down');
                     $trs.each(function(){
                        k = $(this).attr('data-id');
                        if(k.substr(0,k.indexOf('-')+1).indexOf(_id) != -1){
                           $(this).removeClass('hide');
                        }
                     });
                     $tr.attr('data-sign','1');
                  }else if('1' == _sign){
                     $i.removeClass('fa-chevron-down').addClass('fa-chevron-up');
                     $trs.each(function(){
                        k = $(this).attr('data-id');
                        if(k.substr(0,k.indexOf('-')+1).indexOf(_id) != -1){
                           $(this).addClass('hide');
                        }
                     });
                     $tr.attr('data-sign','0');
                  }
               }
            }
         });

         $('.manage-btns').on('click',function(e){
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();

            var _id = $(e.target).attr('data-id');
            console.log(_id);
            if('mod-add' == _id){
               $('#mod-add').modal('show');
            }
         });
      },
      methods: {
         getModuleList: function(){
            Custom.ajaxFn('/Module/GetPageList',{
               data: {page: 1,pageSize: 10},
               callback: function(res){
                  if(res.IsSuccess){
                     var list = vm.list;
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