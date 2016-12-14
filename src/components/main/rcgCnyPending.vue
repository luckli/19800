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
                  <div class="col-xs-4 col-md-4 form-inline text-right">
                     <div class="form-group">
                        <label>搜索</label>
                        <input type="text" class="form-control input-sm" v-model="search.queryText" @keyup.enter="getPendingList()" placeholder="输入账号进行搜索..." />
                     </div>
                     <div class="form-group radio-status">
                        <label><input type="radio" name="status" value="1" v-model="search.status" @change="getPendingList()" /><span>待确认</span></label>
                        <label><input type="radio" name="status" value="2" v-model="search.status" @change="getPendingList()" /><span>已完成</span></label>
                        <label><input type="radio" name="status" value="3" v-model="search.status" @change="getPendingList()" /><span>已失效</span></label>
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="cnyPending-table" class="table table-striped table-bordered table-box">
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
                        <tr v-for="item in items" :data-id="item.Id">
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
                        <tr v-if="0==items.length">
                           <td colspan="9" style="text-align:center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 充值 -->
      <div class="modal fade" id="ca-recharge">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认充值</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">账号</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="item" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">资金来源</label>
                        <div class="col-md-6">
                           <select v-model="fundSourceId" class="form-control">
                              <option v-for="bank in banks" :value="bank.Id">{{bank.AccountNumber}}</option>
                           </select>
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toRecharge()">确认</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 充值 -->

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
                           <input type="text" class="form-control" v-model="item" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">备注</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="reason" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toOK()">确认</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 清理/撤销 -->
   </div>
</template>
<script>
   import Custom from 'custom'
   export default{
      name: 'cnyPending',
      data(){
         return{
            items: [],
            banks: [],
            item: -1,
            fundSourceId: -1,
            reason: '',
            sign: 1,
            search: {queryText: '',status: 1,pageIndex: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         vm.getPendingList();

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            if(2==vm.sign){
               vm.reason = '';
            }
         });

         // 
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个待充值记录";
            if('cny-recharge' == _id){
               if(vm.IsSelected(title,info)){
                  if(0==vm.banks.length){
                     vm.getCapitalAccount();
                  }
                  $('#ca-recharge').modal('show');
               }
            }else if('cny-clear' == _id){
               vm.sign = 1;
               if(vm.IsSelected(title,info)){
                  $('#ca-key').modal('show');
               }
            }else if('cny-revoke' == _id){
               vm.sign = 2;
               if(vm.IsSelected(title,info)){
                  $('#ca-key').modal('show');
               }
            }
         });

         Custom.selectItem('#cnyPending-table',vm.item,function(res){
            vm.item = res;

            for(var i = 0;i<vm.items.length;i++){
               if(res == vm.items[i].Id){

               }
            }
         });
      },
      methods:{
         // 确认充值
         toRecharge: function(){
            var vm = this;

            Custom.ajaxFn('/Deposit/Confirm',{
               data: {depositId: vm.item,fundSourceId: vm.fundSourceId},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPendingList();
                     $('#ca-recharge').modal('show');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 清理无效/撤销充值
         toOK: function(){
            var vm = this,url='';
            if(1 == vm.sign){
               url = '/Deposit/Cancel';
            }else if(2 == vm.sign){
               url = '/Deposit/Reset';
            }

            Custom.ajaxFn(url,{
               data: {depositId: vm.item,reason: vm.reason},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPendingList();
                     $('#ca-key').modal('hide');
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
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                     }
                     vm.items = list;
                  }else{
                     Custom.isSelected({title: '提示',txt: '获取列表失败，'+res.errorMsg,index: vm.item});
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取资金账号列表
         getCapitalAccount: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/List',{
               callback: function(res){
                  if(res.IsSuccess){
                     vm.banks = res.Data;
                     vm.fundSourceId = vm.banks[0].Id;
                  }
               },
               errorCallback: function(res){
                  vm.banks = [];
                  Custom.isSelected({title: '提示',txt: '查看失败，'+res.statusText,index: -1});
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