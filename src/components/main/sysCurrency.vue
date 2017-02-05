<template>
   <div id="content" class="content">
      <h1 class="page-header">币种列表 <small>币种维护<!-- <Test></Test>{{arr[0]}} --></small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">币种列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="currency-add">添加币种</button>
                     <button class="btn btn-inverse" data-id="currency-modify">修改币种</button>
                     <button class="btn btn-inverse" data-id="currency-lock">锁定</button>
                     <button class="btn btn-inverse" data-id="currency-unlock">解锁</button>
                     <button class="btn btn-inverse" data-id="currency-phoneUnlock">余额提醒门槛</button>
                     <button class="btn btn-inverse" data-id="currency-setUserVip">充值提醒门槛</button>
                     <button class="btn btn-inverse" data-id="currency-transferTo">转入冷钱包</button>
                     <button class="btn btn-inverse" data-id="currency-transferFrom">从冷钱包转入</button>
                  </div>
                  <div class="col-xs-4 col-md-4 dataTable-filter text-right">
                     <label for="input-filter">
                        <span>搜索</span>
                        <input type="text" class="form-control input-sm" v-model="pageObj.query" @input="getCurrencyList()" placeholder="输入进行搜索..." />
                     </label>
                  </div>
                  <div class="clearfix"></div>
                  <table id="currency-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>Id</th>
                           <th>Code</th>
                           <th>充值固定手续费</th>
                           <th>充值费率</th>
                           <th>充值提醒线</th>
                           <th>提现最小限额/笔</th>
                           <th>提现最大限额/笔</th>
                           <th>提现固定手续费</th>
                           <th>提现费率</th>
                           <th>提现验证金额门槛</th>
                           <th>余额提醒门槛</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id" v-if="0 != items.length">
                           <td>{{item.Id}}</td>
                           <td>{{item.Code}}</td>
                           <td>{{item.DepositFixedFee}}</td>
                           <td>{{item.DepositFeeRate}} %</td>
                           <td>{{item.DepositNotifyLine}}</td>
                           <td>{{item.WithdrawOnceMin}}</td>
                           <td>{{item.WithdrawOnceLimit}}</td>
                           <td>{{item.WithdrawFixedFee}}</td>
                           <td>{{item.WithdrawFeeRate}} %</td>
                           <td>{{item.WithdrawVerifyLine}}</td>
                           <td>{{item.BalanceNotifyLine}}</td>
                        </tr>
                        <tr v-else>
                           <td colspan="11">表中数据为空</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 添加币种 -->
      <div class="modal fade" id="curr-addModify">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-show="1==sign">添加币种</span><span v-show="2==sign">修改币种</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal form-bordered">
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-code">Code<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-code" placeholder="请输入Code" :readonly="2==sign" v-model="currObj.code" />
                        </div>
                     </div>
                     
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-depositFixedFee">充值固定费用/笔<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-depositFixedFee" placeholder="请输入充值固定费用" v-model="currObj.DepositFixedFee" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-depositFeeRate">充值费率<span>*</span></label>
                        <div class="col-md-6 col-sm-6 input-group">
                           <input type="text" class="form-control" id="curr-depositFeeRate" placeholder="请输入充值费率" v-model="currObj.DepositFeeRate" />
                           <span class="input-group-addon">%</span>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-depositNotifyLine">充值提醒线<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-depositNotifyLine" placeholder="请输入充值提醒线" v-model="currObj.DepositNotifyLine" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-withdrawOnceMin">提现最小限额/笔<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-withdrawOnceMin" placeholder="请输入单次提现最小金额" v-model="currObj.WithdrawOnceMin" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-withdrawOnceLimit">提现最大限额/笔<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-withdrawOnceLimit" placeholder="请输入单次提现最大金额" v-model="currObj.WithdrawOnceLimit" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-withdrawFixedFee">提现固定手续费<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-withdrawFixedFee" placeholder="请输入提现固定手续费" v-model="currObj.WithdrawFixedFee" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-withdrawFeeRate">提现费率<span>*</span></label>
                        <div class="col-md-6 col-sm-6 input-group">
                           <input type="text" class="form-control" id="curr-withdrawFeeRate" placeholder="请输入提现手续费比率" v-model="currObj.WithdrawFeeRate" />
                           <span class="input-group-addon">%</span>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-balanceNotifyLine">余额提醒门槛<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-balanceNotifyLine" placeholder="请输入余额提醒门槛" v-model="currObj.BalanceNotifyLine" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-withdrawVerifyLine">提现验证金额门槛<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-withdrawVerifyLine" placeholder="请输入提现验证金额" v-model="currObj.WithdrawVerifyLine" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-required">虚拟币可交易确认次数<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-required" placeholder="请输入可交易确认次数" v-model="currObj.Required" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-safe">虚拟币安全确认次数<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-safe" placeholder="请输入虚拟币安全确认次数" v-model="currObj.Safe" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-assetId">assetId</label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-assetId" :readonly="2==sign" v-model="currObj.AssetId" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-isVirtualCoin">是不是虚拟币</label>
                        <div class="col-md-6 col-sm-6">
                           <input type="checkbox" id="curr-isVirtualCoin" v-model="currObj.IsVirtualCoin" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-isBasicCoin">是否基本货币</label>
                        <div class="col-md-6 col-sm-6">
                           <input type="checkbox" id="curr-isBasicCoin" v-model="currObj.IsBasicCoin" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="1==sign" @click="addCurrency()">添加</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="2==sign" @click="modifyCurrency()">修改</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 添加币种 -->

      <!-- 锁定 -->
      <div class="modal fade" id="curr-lock">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-show="3==sign">确认要锁定吗？</span><span v-show="4==sign">确认要解锁吗？</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">Code</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="currObj.Code" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="3==sign" @click="toLock()">锁定</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="4==sign" @click="toUnlock()">解锁</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 锁定 -->

      <!-- 提醒门槛 -->
      <div class="modal fade" id="curr-notice">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-show="5==sign">修改预警金额</span><span v-show="6==sign">修改充值通知金额</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">Code</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="currObj.Code" readonly />
                        </div>
                     </div>
                     <div class="form-group" v-show="5==sign">
                        <label class="col-md-4 control-label custom-label">金额</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="currObj.BalanceNotifyLine" />
                        </div>
                     </div>
                     <div class="form-group" v-show="6==sign">
                        <label class="col-md-4 control-label custom-label">金额</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="currObj.DepositNotifyLine" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="5==sign" @click="modifyBalanceNotifyLine()">提交</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="6==sign" @click="modifyDepositNotifyLine()">提交</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 提醒门槛 -->

      <!-- 冷钱包 -->
      <div class="modal fade" id="curr-transfer">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-show="7==sign">虚拟币转入冷钱包</span><span v-show="8==sign">虚拟币接受从冷钱包转入</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">Code</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="currObj.Code" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">冷钱包地址</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" placeholder="请输入冷钱包地址" v-model="cgObj.coldWalletAddress" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">转入金额</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" placeholder="请输入转入金额" v-model="cgObj.volume" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">交易流水号</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" placeholder="请输入交易流水号" v-model="cgObj.txNo" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">备注</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" placeholder="请描述转账的意图" v-model="cgObj.remark" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="7==sign" @click="toTransferTo()">确定</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="8==sign" @click="toAcceptTransferFrom()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 提醒门槛 -->
   </div>
</template>
<script>
   import '../../assets/css/reset'
   import Custom from '../../assets/js/custom'
   //import Test from './test'
   export default {
      name: 'currency',
      data(){
         return {
            pageObj: {query: '',index: 1,size: 10},
            currObj: {IsVirtualCoin: false,IsBasicCoin: false},
            cgObj: {coldWalletAddress: '',volume: 0,txNo: '',remark: ''},
            item: -1,
            items: [],
            sign: 1
         }
      },
      mounted(){
         var vm = this;

         vm.getCurrencyList();
         // 显示弹层
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一种货币";
            if(vm.item != -1){
               for(var i =0;i<vm.items.length;i++){
                  if(vm.item == vm.items[i].Id){
                     vm.currObj = vm.items[i];
                  }
               }
            }
            if('currency-add' == _id){
               vm.sign = 1;
               vm.currObj = {IsVirtualCoin: false,IsBasicCoin: false};
               $('#curr-addModify').modal('show');
            }else if('currency-modify' == _id){
               vm.sign = 2;
               if(vm.IsSelected(title,info)){
                  $('#curr-addModify').modal('show');
               }
            }else if('currency-lock' == _id){
               vm.sign = 3;
               if(vm.IsSelected(title,info)){
                  $('#curr-lock').modal('show');
               }
            }else if('currency-unlock' == _id){
               vm.sign = 4;
               if(vm.IsSelected(title,info)){
                  $('#curr-lock').modal('show');
               }
            }else if('currency-phoneUnlock' == _id){
               vm.sign = 5;
               if(vm.IsSelected(title,info)){
                  $('#curr-notice').modal('show');
               }
            }else if('currency-setUserVip' == _id){
               vm.sign = 6;
               if(vm.IsSelected(title,info)){
                  $('#curr-notice').modal('show');
               }
            }else if('currency-transferTo' == _id){
               vm.sign = 7;
               if(vm.IsSelected(title,info)){
                  $('#curr-transfer').modal('show');
               }
            }else if('currency-transferFrom' == _id){
               vm.sign = 8;
               if(vm.IsSelected(title,info)){
                  $('#curr-transfer').modal('show');
               }
            }
         });

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            if(1==vm.sign){
               vm.currObj = {IsVirtualCoin: false,IsBasicCoin: false};
            }else if(7==vm.sign || 8== vm.sign){
               vm.cgObj = {coldWalletAddress: '',volume: 0,txNo: '',remark: ''};
            }
         });

         Custom.selectItem('#currency-table',vm.item,function(res){
            vm.item = res;
            for(var i =0;i<vm.items.length;i++){
               if(res == vm.items[i].Id){
                  vm.currObj = vm.items[i];
               }
            }
         });
      },
      /*components: {
         Test
      },
      events: {
         'css-fn': function(params){
            var vm = this;
            console.log(params);
            vm.arr.push(params);
         }
      },*/
      methods:{
         // 添加币种
         addCurrency: function(){
            var vm = this;

            if(vm.currObj && vm.currObj.DepositFeeRate){vm.currObj.DepositFeeRate = (vm.currObj.DepositFeeRate * 0.01).toFixed(2);}
            if(vm.currObj && vm.currObj.WithdrawFeeRate){vm.currObj.WithdrawFeeRate = (vm.currObj.WithdrawFeeRate * 0.01).toFixed(2);}
            if(vm.currObj && vm.currObj.Id){delete vm.currObj.Id;}
            Custom.ajaxFn('/Currency/Create',{
               data: vm.currObj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.currObj = {IsVirtualCoin: false,IsBasicCoin: false};
                     vm.getCurrencyList();
                     $('#curr-addModify').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         modifyCurrency: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/Modify',{
               data: vm.currObj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getCurrencyList();
                     $('#curr-addModify').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 锁定
         toLock: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/Lock',{
               data: {Code: vm.currObj.Code},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getCurrencyList();
                     $('#curr-lock').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 解锁
         toUnlock: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/Lock',{
               data: {Code: vm.currObj.Code},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getCurrencyList();
                     $('#curr-lock').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 修改余额提醒门槛
         modifyBalanceNotifyLine: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/ModifyBalanceNotifyLine',{
               data: {Code: vm.currObj.Code,amount: vm.currObj.BalanceNotifyLine},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getCurrencyList();
                     $('#curr-notice').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 修改充值提醒门槛
         modifyDepositNotifyLine: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/ModifyDepositNotifyLine',{
               data: {Code: vm.currObj.Code,amount: vm.currObj.DepositNotifyLine},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getCurrencyList();
                     $('#curr-notice').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 虚拟币转入冷钱包
         toTransferTo: function(){
            var vm = this;
            vm.cgObj.code = vm.currObj.Code;

            Custom.ajaxFn('/Currency/TransferTo',{
               data: vm.cgObj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.cgObj = {coldWalletAddress: '',volume: 0,txNo: '',remark: ''};
                     vm.getCurrencyList();
                     $('#curr-transfer').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 虚拟币接受从冷钱包转入
         toAcceptTransferFrom: function(){
            var vm = this;
            vm.cgObj.code = vm.currObj.Code;

            Custom.ajaxFn('/Currency/AcceptTransferFrom',{
               data: vm.cgObj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.cgObj = {coldWalletAddress: '',volume: 0,txNo: '',remark: ''};
                     vm.getCurrencyList();
                     $('#curr-transfer').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取币种列表
         getCurrencyList: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/GetList',{
               data: {queryText: vm.pageObj.query,pageIndex: vm.pageObj.index,pageSize: vm.pageObj.size},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data.Items;
                  }
               },
               errorCallback: function(res){
                  vm.items = [];
                  vm.IsSelected('提示','获取币种列表,'+res.statusText,-1);
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