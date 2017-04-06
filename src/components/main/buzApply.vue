<template>
   <div id="content" class="content">
      <h1 class="page-header">实名认证申请列表 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">实名认证申请列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-4 col-md-4 manage-btns">
                     <button class="btn btn-inverse" data-id="buz-detail">详细信息</button>
                  </div>
                  <div class="col-xs-8 col-md-8 form-inline text-right">
                     <div class="form-group">
                        <label for="">认证类别</label>
                        <select v-model="search.type" class="form-control input-sm" @change="getPageList()">
                           <option v-for="type in types" :value="type.id">{{type.val}}</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <input type="text" class="form-control input-sm" v-model="search.userId" @keyup.enter="getPageList()" placeholder="输入用户Id进行搜索..." />
                     </div>
                     <div class="form-group">
                        <input type="text" class="form-control input-sm" v-model="search.managerId" @keyup.enter="getPageList()" placeholder="输入审核人编号进行搜索..." />
                     </div>
                     <div class="form-group radio-status">
                        <label v-for="st in status"><input type="radio" name="status" :value="st.id" v-model="search.status" @change="getPageList()" /><span>{{st.val}}</span></label>
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="vApply-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>编号</th>
                           <th>用户名称</th>
                           <th>认证类别</th>
                           <th>认证状态</th>
                           <th>审核人</th>
                           <th>创建时间</th>
                           <th>审核时间</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.UserId">
                           <td>{{item.Id}}</td>
                           <td>{{item.RealName}}</td>
                           <td>
                              <span v-if="1==item.Type">身份证</span>
                              <span v-if="2==item.Type">高级身份</span>
                              <span v-if="3==item.Type">护照</span>
                              <span v-if="4==item.Type">高级护照</span>
                              <span v-if="5==item.Type">台湾通行证</span>
                              <span v-if="6==item.Type">港澳通行证</span>
                              <span v-if="7==item.Type">企业证件</span>
                           </td>
                           <td>
                              <span v-if="0==item.Status">无状态</span>
                              <span v-if="1==item.Status">待审核</span>
                              <span v-if="2==item.Status">审核通过</span>
                              <span v-if="3==item.Status">审核未通过</span>
                           </td>
                           <td>{{item.ManagerName}}</td>
                           <td>{{item.CreateTime}}</td>
                           <td>{{item.AuditTime}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="7" style="text-align: center;">无数据</td>
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
      <!-- 详细信息 -->
      <div class="modal fade" id="mod-detail">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">认证详细信息</h4>
               </div>
               <div class="modal-body">
                  <table class="table table-striped table-bordered detail-box">
                     <tbody>
                        <tr>
                           <td>认证类别</td>
                           <td>{{detailObj.Type}}
                              <!-- <span v-if="1==detailObj.Type">身份证</span>
                              <span v-if="2==detailObj.Type">护照</span>
                              <span v-if="3==detailObj.Type">台湾通行证</span>
                              <span v-if="4==detailObj.Type">港澳通行证</span>
                              <span v-if="5==detailObj.Type">企业证件</span>
                              <span v-if="6==detailObj.Type">特别认证</span> -->
                           </td>
                        </tr>
                        <tr>
                           <td>图片</td>
                           <td>
                              <a v-for="img in detailObj.Images" :href="img" target="_blank" class="pic-style"><img :src="img" alt="图片" /></a>
                           </td>
                        </tr>
                        <tr>
                           <td>认证数据</td>
                           <td>{{detailObj.Data}}</td>
                        </tr>
                        <tr>
                           <td>状态</td>
                           <td>
                              <span v-if="'Apply'==detailObj.Status">待审核</span>
                              <span v-if="'AuditSucess'==detailObj.Status">审核通过</span>
                              <span v-if="'AuditFail'==detailObj.Status">审核失败</span>
                           </td>
                        </tr>
                        <tr>
                           <td>审核人Id</td>
                           <td>{{detailObj.AuditManagerId}}</td>
                        </tr>
                        <tr>
                           <td>审核时间</td>
                           <td>{{detailObj.AuditTime}}</td>
                        </tr>
                        <tr>
                           <td>审核备注</td>
                           <td>{{detailObj.AuditRemark}}</td>
                        </tr>
                        <tr>
                           <td>申请时间</td>
                           <td>{{detailObj.CreateTime}}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
               <div class="modal-footer">
                  <button class="btn btn-sm btn-inverse" v-if="'AuditSucess'!=detailObj.Status" @click="toModal()">去审核</button>
               </div>
            </div>
         </div>
      </div>
      <!-- 详细信息 -->

      <!-- 审核 -->
      <div class="modal fade" id="mod-audit">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">审核</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">用户Id</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="item" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">认证类别</label>
                        <div class="col-md-6">
                           <select class="form-control input-sm" v-model="obj.type">
                              <option v-for="type in types" :value="type.id">{{type.val}}</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">备注</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="obj.remark" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">是否通过</label>
                        <div class="col-md-6">
                           <input type="checkbox" v-model="obj.result" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toAudit()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 审核 -->
   </div>
</template>
<script>
   import Custom from 'custom'
   import Page from 'page'
   export default{
      name: 'validate-apply',
      data(){
         return {
            item: -1,
            items: [],
            total: 0,
            totalItems: 0,
            types: [{id: 1,val: '身份证',en: 'IdCard'},{id: 2,val: '高级身份',en: 'AdvancedIdCard'},{id: 3,val: '护照',en: 'Passport'},{id: 4,val: '高级护照',en: 'AdvancedPassport'},{id: 5,val: '台湾通行证',en: 'TaiwanResidentsPass'},{id: 6,val: '港澳通行证',en: 'HKAndMacauResidentsPass'},{id: 6,val: '企业证件',en: 'EnterpriseCertificate'}],
            status: [{id: 0,val: '无状态'},{id: 1,val: '待审核'},{id: 2,val: '审核通过'},{id: 3,val: '审核未通过'}],
            obj:{type: 1,result: false,remark: ''},
            detailObj: {Type: '',Images: [],Data: '',Status: '',ManagerId: '',AuditTime: '',AuditRemark: '',CreateTime: ''},
            search: {userId: '',managerId: '',type: 1,status: 0,page: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         vm.getPageList();

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个申请记录";
            if('buz-detail' == _id){
               if(vm.IsSelected(title,info)){
                  vm.getDetail();
                  $('#mod-detail').modal('show');
               }
            }
         });

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            if('mod-audit' == $(this).attr('id')){
               vm.obj = {type: 1,result: false,remark: ''};
            }
         });

         Custom.selectItem('#vApply-table',vm.item,function(res){
            vm.item = res;
         });
      },
      methods:{
         // 审核
         toAudit: function(){
            var vm = this;
            vm.obj.userId = vm.item;
            Custom.ajaxFn('/Certification/Audit',{
               data: vm.obj,
               callback: function(res){
                  var msg = '';
                  if(res.IsSuccess){
                     msg = '审核通过！';
                     vm.getPageList();
                  }else{
                     msg = '审核失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
                  $('#mod-detail').modal('hide');
                  $('#mod-audit').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         toModal: function(){
            $('#mod-audit').modal('show');
         },
         // 获取认证详细信息
         getDetail: function(){
            var vm = this;
            vm.detailObj = {},
            Custom.ajaxFn('/Certification/Detail',{
               data: {userId: vm.item,type: vm.search.type},
               callback: function(res){
                  if(res.IsSuccess){
                     if(res.Data){
                        vm.detailObj = res.Data;
                        vm.detailObj.CreateTime = Custom.dateTimeFormatter(res.Data.CreateTime);
                        vm.detailObj.AuditTime = Custom.dateTimeFormatter(res.Data.AuditTime);
                        for(var i =0;i<vm.types.length;i++){
                           if(vm.detailObj.Type == vm.types[i].en){
                              vm.detailObj.Type = vm.types[i].val;
                              break;
                           }
                        }
                     }
                  }else{
                     Custom.isSelected({title: '提示',txt: '获取失败，'+res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取申请列表
         getPageList: function(){
            var vm = this;
            Custom.ajaxFn('/Certification/GetPageList',{
               data: vm.search,
               callback: function(res){
                  var list = [];
                  if(res.IsSuccess){
                     list = res.Data.Items;
                     for(var i=0;i<list.length;i++){
                        list[i].CreateTime = Custom.dateTimeFormatter(list[i].CreateTime);
                        list[i].AuditTime = Custom.dateTimeFormatter(list[i].AuditTime);
                     }
                     vm.items = list;

                     vm.total = res.Data.TotalPage;
                     vm.search.page = res.Data.CurrentPage;
                     vm.totalItems = res.Data.TotalItems;
                  }else{
                     Custom.isSelected({title: '提示',txt: '获取失败，'+res.ErrorMsg,index: -1});
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
<style lang="less">
   .detail-box{
      >tbody{
         >tr{
            >td{
               &:first-child{ width: 14%;}
            }
         }
      }
   }
</style>