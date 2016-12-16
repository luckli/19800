<template>
   <div id="content" class="content">
      <h1 class="page-header">赛波分红 <small>赛波分红</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">赛波分红</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="buz-dividends">确认分红</button>
                  </div>
                  <div class="col-xs-4 col-md-4 form-inline text-right">
                     <div class="form-group">
                        <label for="">发放日期</label>
                        <select v-model="search.period" class="form-control input-sm" @change="getPageList()">
                           <option v-for="dt in dates" :value="dt.id">{{dt.val}}</option>
                        </select>
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="dividends-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>用户名称</th>
                           <th>Email</th>
                           <th>发放日期</th>
                           <th>拥有数量</th>
                           <th>分红金额</th>
                           <th>是否已分红</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.id">
                           <td>{{item.UserName}}</td>
                           <td>{{item.Email}}</td>
                           <td>{{item.AllottedAt}}</td>
                           <td>{{item.HeldVolume}}</td>
                           <td>{{item.PayAmount}}</td>
                           <td><span v-if="item.IsAllotted">已分红</span><span v-else>未分红</span></td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="6" style="text-align: center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 分红 -->
      <div class="modal fade" id="mod-dividends">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">分红</h4>
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
                        <label class="col-md-4 control-label custom-label">期间</label>
                        <div class="col-md-6">
                           <select class="form-control input-sm" v-model="period">
                              <option v-for="pd in periods" :value="pd.id">{{pd.val}}</option>
                           </select>
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toAllot()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 分红 -->
   </div>
</template>
<script>
   import Custom from 'custom'
   export default{
      name: 'dividends',
      data(){
         return{
            items: [],
            item: -1,
            periods: [],
            period: '',
            search: {pageIndex: 1,pageSize: 10,period: '20161212-20161218'}
         }
      },
      mounted(){
         var vm = this;

         vm.getIssueDateList();

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个用户";
            if('buz-dividends' == _id){
               //if(vm.IsSelected(title,info)){
                  $('#mod-dividends').modal('show');
               //}
            }
         });

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            if('mod-audit' == $(this).attr('id')){
               vm.obj = {type: 1,result: false,remark: ''};
            }
         });
      },
      methods:{
         // 确认分红
         toAllot: function(){
            var vm = this;
            Custom.ajaxFn('/Dividend/Allot',{
               data: {period: vm.period},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取发放日期列表
         getIssueDateList: function(){
            var vm = this;
            vm.getPageList();
            /*Custom.ajaxFn('',{
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });*/
         },
         getPageList: function(){
            var vm = this;

            Custom.ajaxFn('/Dividend/GetList',{
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
         }
      }
   }
</script>