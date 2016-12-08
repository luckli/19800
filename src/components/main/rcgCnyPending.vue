<template>
   <div id="content" class="content">
      <h1 class="page-header">人民币待确认充值列表 <small>新的充值方式</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">人民币待确认充值列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="cny-recharge">确认充值</button>
                     <button class="btn btn-inverse" data-id="cny-clear">清理无效充值</button>
                     <button class="btn btn-inverse" data-id="cny-revoke">撤销充值确认</button>
                  </div>
                  <div class="clearfix"></div>
                  <table id="account-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>充值id</th>
                           <th>用户姓名</th>
                           <th>邮件地址</th>
                           <th>金额</th>
                           <th>手续费</th>
                           <th>第三方手续费</th>
                           <th>备注</th>
                           <th>充值状态</th>
                           <th>创建时间</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items">
                           <td>{{item.Id}}</td>
                           <td>{{item.UserName}}</td>
                           <td>{{item.Email}}</td>
                           <td>{{item.Amount}} %</td>
                           <td>{{item.Fee}}</td>
                           <td>{{item.TxFee}}</td>
                           <td>{{item.Remark}} %</td>
                           <td><span v-show="1 == item.Status">提交申请</span>
                              <span v-show="2 == item.Status">验证失败</span>
                              <span v-show="3 == item.Status">充值完成</span>
                              <span v-show="4 == item.Status">过期-失效</span>
                              <span v-show="5 == item.Status">取消</span>
                           </td>
                           <td>{{item.CreatedAt}}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 清理/撤销 -->
      <div class="modal fade" id="ca-key">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-show="1==sign">清理无效充值</span><span v-show="2==sign">撤销充值</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">账号</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="1==sign" @click="toLock()">确认</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="2==sign" @click="toUnlock()">确认</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 清理/撤销 -->
   </div>
</template>
<script>
   import Custom from '../../assets/js/custom'
   export default{
      name: 'pending',
      data(){
         return{
            items: [],
            reason: '',
            sign: 1,
            pageObj: {queryText: '',pageIndex: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         vm.getPendingList();

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            if('ca-key' == $(this).attr('id')){
               vm.reason = '';
            }
         });

         // 
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择需要销毁的充值码";
            if('cny-recharge' == _id){
               $('#ca-add').modal('show');
            }else if('ca-lock' == _id){
               vm.sign = 1;
               if(vm.IsSelected(title,info)){
                  $('#ca-key').modal('show');
               }
            }
         });
      },
      methods:{
         // 确认充值
         toRecharge: function(){
            var vm = this;

            Custom.ajaxFn('/Deposit/Confirm',{
               data: {depositId: vm.item,fundSourceId: ''},
               callback: function(res){
                  if(res.IsSuccess){
                     
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 清理无效充值
         toClear: function(){
            var vm = this;

            Custom.ajaxFn('/Deposit/Cancel',{
               data: {depositId: vm.item,reason: vm.reason},
               callback: function(res){
                  if(res.IsSuccess){
                     
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 撤销充值确认
         toRevoke: function(){
            var vm = this;

            Custom.ajaxFn('/Deposit/Reset',{
               data: {depositId: vm.item,reason: vm.reason},
               callback: function(res){
                  if(res.IsSuccess){
                     
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取待确认充值列表
         getPendingList: function(){
            var vm = this;

            Custom.ajaxFn('/Deposit/GetPendingList',{
               data: vm.pageObj,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                     }
                     vm.items = list;
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