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
                           <option value="4">市场</option>
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
                           <!-- <th>语言</th> -->
                           <th>标题</th>
                           <th>关键字</th>
                           <th>简介</th>
                           <th>发布时间</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>
                              <span v-if="1==item.NewsType">新闻</span>
                              <span v-if="2==item.NewsType">公告</span>
                              <span v-if="3==item.NewsType">帮助</span>
                              <span v-if="4==item.NewsType">市场</span>
                           </td>
                           <!-- <td><span v-if="0==item.LangType">CN</span><span v-if="1==item.LangType">EN</span></td> -->
                           <td>{{item.Title}}</td>
                           <td>{{item.KeyWords}}</td>
                           <td>{{item.Intro}}</td>
                           <td>{{item.PublishTime}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="7" style="text-align:center;">无数据</td>
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
   import Custom from 'custom'
   import Page from 'page'
   export default {
      name: 'cms',
      data(){
         return{
            items: [],
            item: -1,
            sign: 1,
            flag: false,
            paramObj: {},
            totalItems: 0,
            total: 0,
            obj: {newsType: 1,langType: 0,title: '',keyWords: '',intro: '',content: '',publishTime: '',tag: '',cover: '',linkUrl: ''},
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
               vm.$router.push({path: 'sysAddCMS'});
               //$('#mod-cmsOperate').modal('show');
            }else if('cms-modify' == _id){
               if(vm.IsSelected(title,info)){
                  vm.sign = 2;
                  vm.$router.push({name: 'sysModifyCMS',params: {Id: vm.paramObj}});
                  //$('#mod-cmsOperate').modal('show');
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
                     vm.obj.title = vm.items[i].Title;
                  }
               }
            }
         });

         //vm.editor = Custom.initEditor('news-box');

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            vm.obj = {newsType: 1,langType: 0,title: '',keyWords: '',intro: '',content: '',publishTime: ''};
         });

         Custom.selectItem('#cms-table',vm.item,function(res){
            for(var i = 0;i<vm.items.length;i++){
               if(res==vm.items[i].Id){
                  vm.paramObj.id = vm.items[i].Id;
                  vm.paramObj.newsType = vm.items[i].NewsType;
                  vm.paramObj.langType = vm.items[i].LangType;
                  vm.paramObj.title = vm.items[i].Title;
                  vm.paramObj.keyWords = vm.items[i].KeyWords;
                  vm.paramObj.intro = vm.items[i].Intro;
                  vm.paramObj.content = vm.items[i].Content;
                  vm.paramObj.publishTime = vm.items[i].PublishTime;
                  vm.paramObj.cover = vm.items[i].Cover;
                  vm.paramObj.tag = vm.items[i].Tag;
                  vm.paramObj.linkUrl = vm.items[i].LinkUrl;
               }
            }
            vm.item = res;
         });
      },
      methods:{
         // 删除
         toDel: function(){
            var vm = this;

            Custom.ajaxFn('/news/Delete',{
               data: {id: vm.item},
               vm: vm,
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
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items || [];
                     for(var i = 0;i<list.length;i++){
                        list[i].PublishTime = Custom.dateFormatter(list[i].PublishTime);
                     }
                     vm.items = list;
                     vm.total = res.Data.TotalPage;
                     vm.totalItems = res.Data.TotalItems;
                     vm.search.page = res.Data.CurrentPage;
                  }else{
                     Custom.isSelected({title: '提示',txt: '获取列表失败,'+res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         pageFn: function(index){
            var vm = this;
            vm.search.page = index;
            vm.getPageList();
         },
         // 请选择一个管理员
         IsSelected: function(title,txt){
            var vm = this;
            
            return Custom.isSelected({title: title,txt: txt,index: vm.item});
         }
      },
      components:{
         Page
      },
      replace: true
   }
</script>