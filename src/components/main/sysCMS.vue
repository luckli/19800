<template>
   <div id="content" class="content">
      <h1 class="page-header">cms管理 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">cms管理</h4></div>
               <div class="panel-body">
                  <div class="col-md-8 col-xs-8 manage-btns">
                     <button class="btn btn-inverse" data-id="cms-add">添加</button>
                     <button class="btn btn-inverse" data-id="cms-modify">修改</button>
                     <button class="btn btn-inverse" data-id="cms-del">删除</button>
                  </div>
                  <div class="col-md-4 col-xs-4 form-inline text-right search">
                     <div class="form-group">
                        <label>类别</label>
                        <select class="form-control input-sm" v-model="search.newsType" @change="getPageList()">
                           <option value="-1">请选择</option>
                           <option value="1">新闻</option>
                           <option value="2">公告</option>
                           <option value="3">帮助</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <label>语言</label>
                        <select class="form-control input-sm" v-model="search.langType" @change="getPageList()">
                           <option value="-1">请选择</option>
                           <option value="0">CN</option>
                           <option value="1">EN</option>
                        </select>
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="cms-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>类别</th>
                           <th>语言</th>
                           <th>标题</th>
                           <th>关键字</th>
                           <th>简介</th>
                           <th>内容</th>
                           <th>发布时间</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td><span v-if="1==item.NewsType">新闻</span><span v-if="2==item.NewsType">公告</span><span v-if="3==item.NewsType">帮助</span></td>
                           <td><span v-if="0==item.LangType">CN</span><span v-if="1==item.LangType">EN</span></td>
                           <td>{{item.Title}}</td>
                           <td>{{item.KeyWords}}</td>
                           <td>{{item.Intro}}</td>
                           <td>{{item.Content}}</td>
                           <td>{{item.PublishTime}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="7" style="text-align:center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 添加/修改 -->
      <div class="modal fade" id="mod-cmsOperate">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-if="1==sign">添加</span><span v-if="2==sign">修改</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">内容类别<span>*</span></label>
                        <div class="col-md-6">
                           <select class="form-control" v-model="obj.newsType">
                              <option value="-1">请选择</option>
                              <option value="1">新闻</option>
                              <option value="2">公告</option>
                              <option value="3">帮助</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">语言<span>*</span></label>
                        <div class="col-md-6">
                           <select class="form-control" v-model="obj.langType">
                              <option value="-1">请选择</option>
                              <option value="0">CN</option>
                              <option value="1">EN</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">标题<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" placeholder="请输入标题" v-model="obj.title" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">关键字<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" placeholder="请输入关键字" v-model="obj.keyWords" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">简介<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" placeholder="请输入简介" v-model="obj.intro" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">内容<span>*</span></label>
                        <div class="col-md-6">
                           <textarea class="form-control" placeholder="请输入内容" v-model="obj.content"></textarea>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">发布时间<span>*</span></label>
                        <div class="col-md-6 publish-date" id="publish-date">
                           <input type="text" class="form-control" placeholder="发布时间" readonly />
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
      <!-- 添加/修改 -->
      
      <!-- 删除 -->
      <div class="modal fade" id="mod-cmsDel">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确定删除该记录咩？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">标题</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="obj.title" readonly />
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
   import '../../assets/lib/datepicker'
   import '../../assets/lib/bootstrap-datepicker'
   import Custom from 'custom'
   export default {
      name: 'cms',
      data(){
         return{
            items: [],
            item: -1,
            sign: 1,
            obj: {newsType: 1,langType: 0,title: '',keyWords: '',intro: '',content: '',publishTime: ''},
            search: {newsType: -1,langType: -1,page: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;
         vm.getPageList();

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个记录";
            if('cms-add' == _id){
               vm.sign = 1;
               $('#mod-cmsOperate').modal('show');
            }else if('cms-modify' == _id){
               if(vm.IsSelected(title,info)){
                  vm.sign = 2;
                  $('#mod-cmsOperate').modal('show');
               }
            }else if('cms-del' == _id){
               if(vm.IsSelected(title,info)){
                  vm.sign = 3;
                  $('#mod-cmsDel').modal('show');
               }
            }
            if(1 != vm.sign && -1 != vm.sign){
               for(var i = 0;i<vm.items.length;i++){
                  if(vm.item == vm.items[i].Id){
                     vm.obj.newsType = vm.items[i].NewsType;
                     vm.obj.langType = vm.items[i].LangType;
                     vm.obj.title = vm.items[i].Title;
                     vm.obj.keyWords = vm.items[i].KeyWords;
                     vm.obj.intro = vm.items[i].Intro;
                     vm.obj.content = vm.items[i].Content;
                     vm.obj.publishTime = vm.items[i].PublishTime;
                  }
               }
            }
         });

         
         $('.publish-date input').datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd'
         }).on('changeDate',function(ev){
            $('.publish-date input').each(function(){
               vm.obj.publishTime = $(this).val();
            });
         });

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            vm.obj = {newsType: 1,langType: 0,title: '',keyWords: '',intro: '',content: '',publishTime: ''};
         });

         Custom.selectItem('#cms-table',vm.item,function(res){
            vm.item = res;
         });
      },
      methods:{
         // 操作
         toOperate: function(){
            var vm = this,url = '';
            if(1==vm.sign){
               url = '/news/Add';
            }else if(2==vm.sign){
               url = '/news/Update';
               vm.$set(vm.obj,'id',vm.item);
            }

            Custom.ajaxFn(url,{
               data: vm.obj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: '操作失败,'+res.ErrorMsg,index: -1});
                  }
                  $('#mod-cmsOperate').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 删除
         toDel: function(){
            var vm = this;

            Custom.ajaxFn('/news/Delete',{
               data: {id: vm.item},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: '删除失败,'+res.ErrorMsg,index: -1});
                  }
                  $('#mod-cmsDel').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取列表
         getPageList: function(){
            var vm = this,data = {};
            for(var key in vm.search){
               if(null != vm.search[key] && '' != vm.search[key] && -1 != vm.search[key]){
                  data[key] = vm.search[key];
               }
            }

            Custom.ajaxFn('/news/GetPageList',{
               data: data,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items || [];
                     for(var i = 0;i<list.length;i++){
                        list[i].PublishTime = Custom.dateFormatter(list[i].PublishTime);
                     }
                     vm.items = list;
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
      }
   }
</script>