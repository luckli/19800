<template>
   <div id="content" class="content">
      <h1 class="page-header">多语言管理界面 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">多语言管理界面</h4></div>
               <div class="panel-body">
                  <div class="col-md-8 col-xs-8 manage-btns">
                     <button class="btn btn-inverse" data-id="lang-add">添加</button>
                     <button class="btn btn-inverse" data-id="lang-modify">修改</button>
                     <button class="btn btn-inverse" data-id="lang-del">删除</button>
                  </div>
                  <div class="col-md-4 col-xs-4 form-inline text-right search">
                     <div class="form-group">
                        <label>搜索</label>
                        <input type="text" class="form-control input-sm" placeholder="请输入key关键字搜索" v-model="search.key" @keyup.enter="getPageList()" />
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="language-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>编号</th>
                           <th>语句Code</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.Id}}</td>
                           <td>{{item.Key}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="2" style="text-align:center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 添加/修改 -->
      <div class="modal fade" id="mod-operate">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-if="1==sign">添加</span><span v-if="2==sign">修改</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">Code<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="obj.key" />
                        </div>
                     </div>
                     <div class="form-group">
                        <table id="language-table" class="table table-striped table-bordered table-box text-center">
                           <thead>
                              <tr>
                                 <th class="text-center">语言</th>
                                 <th class="text-center">文本</th>
                                 <th class="text-center">操作</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr v-for="(code,ix) in codeList" :data-id="ix">
                                 <td><span v-if="0==code.Lang">CN</span><span v-if="1==code.Lang">EN</span></td>
                                 <td>{{code.Text}}</td>
                                 <td><button class="btn btn-inverse btn-xs" @click.stop="toDelCode(ix)">删除</button></td>
                              </tr>
                              <tr v-if="0 == codeList.length">
                                 <td colspan="3" style="text-align:center;">无数据</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                     <div class="form-group">
                        <label class="col-md-2 control-label custom-label">语言</label>
                        <div class="col-md-3">
                           <select id="langType" class="form-control" v-model="langType">
                              <option value="0">CN</option>
                              <option value="1">EN</option>
                           </select>
                        </div>
                        <label class="col-md-1 control-label custom-label">文本</label>
                        <div class="col-md-5">
                           <div class="input-group">
                              <input type="text" class="form-control" v-model="langText" placeholder="点击加号添加多个文本" />
                              <div class="input-group-addon cp" @click="toAddCode()"><i class="glyphicon glyphicon-plus"></i></div>
                           </div>
                        </div>
                     </div>
                     <div class="form-group">
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
      <!-- 添加/修改 -->

      <!-- 删除 -->
      <div class="modal fade" id="mod-del">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确定删除该记录咩？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">编号</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" name="lock-user" v-model="item" readonly />
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
   export default {
      name: 'language',
      data(){
         return{
            items: [],
            item: -1,
            sign: 1,
            codeList: [],
            langType: 0,
            langText: '',
            obj: {key: '',textList: []},
            search: {key: '',page: 1,pageSize: 10}

         }
      },
      mounted(){
         var vm = this;

         vm.getPageList();

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个记录";
            if('lang-add' == _id){
               vm.sign = 1;
               $('#mod-operate').modal('show');
            }else if('lang-modify' == _id){
               if(vm.IsSelected(title,info)){
                  vm.sign = 2;
                  $('#mod-operate').modal('show');
               }
            }else if('lang-del' == _id){
               if(vm.IsSelected(title,info)){
                  vm.sign = 3;
                  $('#mod-del').modal('show');
               }
            }
            if(1 != vm.sign && -1 != vm.sign){
               for(var i = 0;i<vm.items.length;i++){
                  if(vm.item == vm.items[i].Id){
                     vm.obj.key = vm.items[i].Key;
                     var list = vm.items[i].TextList;
                     for(var j = 0;j<list.length;j++){
                        vm.codeList.push(list[j]);
                     }
                  }
               }
            }
         });

         Custom.selectItem('#language-table',vm.item,function(res){
            vm.item = res;
         });

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            vm.obj = {key: '',textList: []};
            vm.codeList = [];
         });
      },
      methods:{
         // 添加语句
         toAddCode: function(){
            var vm = this;
            if(0==vm.langText.length){
               Custom.isSelected({title: '提示',txt: '请输入文本',index: -1});
               return false;
            }else{
               for(var i =0;i<vm.codeList.length;i++){
                  if(vm.langType == vm.codeList[i].Lang){
                     Custom.isSelected({title: '提示',txt: '同种语言只能添加一次',index: -1});
                     return false;
                  }
               }
            }
            vm.codeList.push({Lang: vm.langType,Text: vm.langText});
            vm.langType = 0;
            vm.langText = '';
         },
         toDelCode: function(index){
            var vm = this;

            vm.codeList.splice(index,1);
         },
         // 添加
         toOperate: function(){
            var vm = this,url = "";
            if(1==vm.sign){
               url = '/lang/Add';
            }else if(2==vm.sign){
               url = '/lang/Update';
               vm.$set(vm.obj,'id',vm.item);
            }
            for(var i = 0;i<vm.codeList.length;i++){
               vm.obj.textList[i] = vm.codeList[i];
            }
            Custom.ajaxFn(url,{
               data: vm.obj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: '操作失败,'+res.ErrorMsg,index: -1});
                  }
                  $('#mod-operate').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 删除
         toDel: function(){
            var vm = this;

            Custom.ajaxFn('/lang/Delete',{
               data: {id: vm.item},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: '获取列表失败,'+res.ErrorMsg,index: -1});
                  }
                  $('#mod-del').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取列表
         getPageList: function(){
            var vm = this;

            Custom.ajaxFn('/lang/GetPageList',{
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data || [];
                     vm.item = -1;
                  }else{
                     Custom.isSelected({title: '提示',txt: '获取列表失败,'+res.ErrorMsg,index: -1});
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
<style lang="less">
   .codeList{
      >li{background-color: #eee; border-radius: 5px; font-size: 12px; float: left; padding: 2px 5px; margin-right: 20px; margin-bottom: 10px; position: relative;
         >i{position: absolute; right: -5px; top: -5px; cursor: pointer;}
      }
   }
</style>