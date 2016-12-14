<template>
   <div id="content" class="content">
      <h1 class="page-header">实名认证申请列表 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">实名认证申请列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-4 col-md-4 manage-btns">
                     <button class="btn btn-inverse" data-id="buz-audit">审核</button>
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
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.Id}}</td>
                           <td>{{item.RealName}}</td>
                           <td>
                              <span v-if="1==item.Type">身份证</span>
                              <span v-if="2==item.Type">护照</span>
                              <span v-if="3==item.Type">台湾通行证</span>
                              <span v-if="4==item.Type">港澳通行证</span>
                              <span v-if="5==item.Type">企业证件</span>
                              <span v-if="6==item.Type">特别认证</span>
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
               </div>
            </div>
         </div>
      </div>
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
                           <select class="form-control input-sm">
                              <option v-for="type in types" :value="type.id">{{type.val}}</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">备注</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">是否通过</label>
                        <div class="col-md-6">
                           <input type="checkbox" />
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

      <!-- 详细信息 -->
      <div class="modal fade" id="mod-detail">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">认证详细信息</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">认证类别</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="getDetail()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 详细信息 -->
   </div>
</template>
<script>
   import Custom from 'custom'
   export default{
      name: 'validate-apply',
      data(){
         return {
            items: [],
            types: [{id: 1,val: '身份证'},{id: 2,val: '护照'},{id: 3,val: '台湾通行证'},{id: 4,val: '港澳通行证'},{id: 5,val: '企业证件'},{id: 6,val: '特别认证'}],
            status: [{id: 0,val: '无状态'},{id: 1,val: '待审核'},{id: 2,val: '审核通过'},{id: 3,val: '审核未通过'}],
            item: -1,
            search: {userId: '',managerId: '',type: 1,status: 0,page: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         vm.getPageList();

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个申请记录";
            if('buz-audit' == _id){
               if(vm.IsSelected(title,info)){
                  $('#mod-audit').modal('show');
               }
            }else if('buz-detail' == _id){
               if(vm.IsSelected(title,info)){
                  $('#mod-detail').modal('show');
               }
            }
         });
      },
      methods:{
         // 审核
         toAudit: function(){
            var vm = this;

            Custom.ajaxFn('/Certification/Audit',{
               data: {userId: vm.item,type: vm.search.type,result: false,remark: ''},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                  }
                  $('#mod-audit').modal('hide');
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取认证详细信息
         getDetail: function(){
            var vm = this;

            Custom.ajaxFn('/Certification/Detail',{
               data: {userId: vm.item,type: vm.search.type},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                  }
                  $('#mod-audit').modal('hide');
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取申请列表
         getPageList: function(){
            var vm = this;
            Custom.ajaxFn('/Certification/GetPageList',{
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