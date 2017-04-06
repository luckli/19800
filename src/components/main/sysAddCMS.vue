<template>
   <div id="content" class="content">
      <h1 class="page-header">文章编辑 <small>文章创建及编辑</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">文章编辑</h4></div>
               <div class="panel-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-2 control-label custom-label">内容类别<span>*</span></label>
                        <div class="col-md-8">
                           <select class="form-control" v-model="obj.newsType">
                              <option value="-1">请选择</option>
                              <option value="1">新闻</option>
                              <option value="2">公告</option>
                              <option value="3">帮助</option>
                              <option value="4">市场</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-2 control-label custom-label">语言<span>*</span></label>
                        <div class="col-md-8">
                           <select class="form-control" v-model="obj.langType">
                              <option value="-1">请选择</option>
                              <option value="0">CN</option>
                              <option value="1">EN</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-2 control-label custom-label">标题<span>*</span></label>
                        <div class="col-md-8">
                           <input type="text" class="form-control" placeholder="请输入标题" v-model="obj.title" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-2 control-label custom-label">关键字</label>
                        <div class="col-md-8">
                           <input type="text" class="form-control" placeholder="请输入关键字" v-model="obj.keyWords" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-2 control-label custom-label">简介</label>
                        <div class="col-md-8">
                           <input type="text" class="form-control" placeholder="请输入简介" v-model="obj.intro" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-2 control-label custom-label">内容<span>*</span></label>
                        <div class="col-md-8">
                           <!-- <Editor id="editor_id" height="400px" width="100%" :content="obj.content"
                              :afterChange="afterChange()"
                              pluginsPath="/static/kindeditor/plugins/"
                              :loadStyleMode="false"
                              @on-content-change="onContentChange"></Editor> -->
                           <textarea name="editor" id="editor-area" style="width: 100%; height: 400px;"></textarea>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-2 control-label custom-label">标记</label>
                        <div class="col-md-8">
                           <input type="text" class="form-control" placeholder="请输入内容" v-model="obj.tag"/>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-2 control-label custom-label">文章来源地址</label>
                        <div class="col-md-8">
                           <input type="text" class="form-control" placeholder="请输入内容" v-model="obj.linkUrl" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-2 col-sm-4 control-label custom-label" for="upload-pic">封面图</label>
                        <div class="col-md-8 col-sm-6">
                           <label for="upload-pic" class="btn btn-sm btn-success"><i class="fa fa-plus"></i>图片</label>
                           <label class="btn btn-sm btn-inverse" @click="upload()" v-show="flag">上传</label>
                           <span v-if="obj.cover">{{obj.cover}}</span>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-2 control-label custom-label">发布时间</label>
                        <div class="col-md-8 publish-date" id="publish-date">
                           <input type="text" class="form-control" placeholder="发布时间" v-model="obj.publishTime" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-2 control-label custom-label">&nbsp;</label>
                        <div class="col-md-8">
                           <button type="button" class="btn btn-inverse" v-if="1==sign" @click="addNews()">添加</button>
                           <button type="button" class="btn btn-inverse" v-if="2==sign" @click="addNews()">修改</button>
                           <a href="/#/main/sysCMS" class="btn btn-inverse">取消</a>
                        </div>
                     </div>
                  </form>
                  <form enctype="multipart/form-data" id="upload-img" method="post">
                     <input type="file" name="upfile" id="upload-pic" @change="imgFn" />
                  </form>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<script>
   import '../../assets/lib/datepicker'
   import '../../assets/lib/bootstrap-datepicker'
   /*import '../../assets/lib/kindeditor/kindeditor-all'
   import '../../assets/lib/kindeditor/themes/default/default'*/
   import '../../assets/lib/nicEdit/nicEdit'
   import Editor from 'kindEditor'
   /*import '../../assets/lib/utf8-php/ueditor.config'
   import '../../assets/lib/utf8-php/ueditor.parse.min'
   import '../../assets/lib/utf8-php/ueditor.all'
   import '../../assets/lib/utf8-php/lang/zh-cn/zh-cn'
   import '../../assets/lib/utf8-php/lang/en/en'*/
   
   import Custom from 'custom'
   export default {
      name: 'addCms',
      data(){
         return{
            sign: 1,
            pId: -1,
            flag: false,
            area: null,
            obj: {newsType: -1,langType: -1,title: '',keyWords: '',intro: '',content: '',publishTime: '',tag: '',cover: '',linkUrl: ''}
         }
      },
      mounted(){
         var vm = this;
         $('.publish-date input').datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd',
            initialDate: new Date()
         }).on('changeDate',function(ev){
            $('.publish-date input').each(function(){
               vm.obj.publishTime = $(this).val();
            });
         });
         vm.area = new nicEditor({fullPanel : true}).panelInstance('editor-area');
         var date = new Date();
         var month = date.getMonth()+1,
            day = date.getDate();
         if(month<=9){
            month = '0'+month;
         }
         if(day<=9){
            day = '0'+day;
         }
         vm.obj.publishTime = date.getFullYear() +'-'+ month +'-'+ day;
         if(0!=Object.keys(vm.$route.params).length){
            vm.sign = 2;
            vm.obj = vm.$route.params.Id;
            console.log(vm.obj);
            vm.area.nicInstances[0].setContent(vm.obj.content);
         }
         
      },
      methods:{
         afterChange: function(val){
         },
         onContentChange: function(val){
            var vm = this;
            vm.obj.content = val;
         },
         // 添加
         addNews: function(){
            var vm = this,url = '/news/Add';
            if(2==vm.sign){
               url = '/news/Update';
               //vm.$set(vm.obj,'id',vm.item);
            }
            vm.obj.content = vm.area.nicInstances[0].getContent();
            Custom.ajaxFn(url,{
               data: vm.obj,
               vm: vm,
               callback: function(res){
                  var msg = '添加成功！';
                  if(res.IsSuccess){
                     if(2==vm.sign){
                        msg = '编辑成功！';
                     }else{
                        Custom.resetForms($('form'));
                     }
                  }else{
                     msg = '操作失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
                  $('#mod-cmsOperate').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 仅图片上传过滤
         imgFn: function(that){
            var vm = this,
               allowed = ['image/jpg', 'image/jpeg', 'image/png'],
               files = that.target.files[0];

            if(-1!=allowed.indexOf(files.type)){
               vm.flag = true;
            }
         },
         // 上传图片
         upload: function(){
            var vm = this;
            Custom.ajaxUpload($('#upload-img'),{
               callback: function(res){
                  if('SUCCESS'==res.state){
                     vm.obj.cover = res.url;
                     $('#upload-img')[0].reset();
                     vm.flag = false;
                  }
               }
            });
         }
      },
      components:{
         Editor
      },
      replace: true
   }
</script>