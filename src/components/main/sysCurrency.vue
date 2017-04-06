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
                     <button class="btn btn-inverse" data-id="currency-balance">余额提醒门槛</button>
                     <button class="btn btn-inverse" data-id="currency-deposit">充值提醒门槛</button>
                     <!-- <button class="btn btn-inverse" data-id="currency-transferTo">转入冷钱包</button>
                     <button class="btn btn-inverse" data-id="currency-transferFrom">冷钱包转出</button>
                     <button class="btn btn-inverse" data-id="currency-hardTransfer">硬性支出</button> -->
                  </div>
                  <div class="col-xs-4 col-md-4 dataTable-filter text-right">
                     <label for="input-filter">
                        <span>搜索</span>
                        <input type="text" class="form-control input-sm" v-model="search.queryText" @change="getCurrencyList()" placeholder="输入进行搜索..." />
                     </label>
                  </div>
                  <div class="clearfix"></div>
                  <table id="currency-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>Id</th>
                           <th>充值</th>
                           <th>提现</th>
                           <th>余额提醒门槛</th>
                           <th>锁定状态</th>
                           <th>区块链地址</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id" v-if="0 != items.length">
                           <td>{{item.Id}}</td>
                           <td>
                              <span class="bold">固定手续费：</span>{{item.DepositFixedFee}}<br />
                              <span class="bold">费率：</span>{{item.DepositFeeRate}}<br />
                              <span class="bold">提醒线：</span>{{item.DepositNotifyLine}}<br />
                           </td>
                           <td>
                              <span class="bold">最小限额/笔：</span>{{item.WithdrawOnceMin}}<br />
                              <span class="bold">最大限额/笔：</span>{{item.WithdrawOnceLimit}}<br />
                              <span class="bold">固定手续费：</span>{{item.WithdrawFixedFee}}<br />
                              <span class="bold">费率：</span>{{item.WithdrawFeeRate}}<br />
                              <span class="bold">固定手续费：</span>{{item.WithdrawVerifyLine}}<br />
                           </td>
                           <td>{{item.BalanceNotifyLine}}</td>
                           <td><span v-if="item.IsLocked">锁定</span><span v-else>正常</span></td>
                           <td>{{item.ExplorerUrl}}</td>
                        </tr>
                        <tr v-else>
                           <td colspan="11">表中数据为空</td>
                        </tr>
                     </tbody>
                  </table>
                  <div>
                     <label>显示第 <span>{{(search.pageIndex*search.pageSize)-9}}</span> 至 <span>{{search.pageIndex*search.pageSize}}</span> 项结果，共 <span>{{totalItems}}</span> 项</label>
                     <Page class="pull-right" :index="search.pageIndex" :size="search.pageSize" :total="total" :callbacks="pageFn"></Page>
                  </div>
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
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-code">Id<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-code" placeholder="币种英文简写，如cny,btc..." :readonly="2==sign" v-model="currObj.Id" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="upload-pic">货币图标<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <img :src="currObj.ImageUrl" id="currency-pic" v-show="currObj.ImageUrl && ''!=currObj.ImageUrl" alt="图标">
                           <label for="upload-pic" class="btn btn-sm btn-success"><i class="fa fa-plus"></i>添加货币图标</label>
                           <label class="btn btn-sm btn-inverse" @click="upload()" v-show="flag">上传</label>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-name">名称<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-name" placeholder="币种中文名称，如人民币,比特币..." v-model="currObj.Name" />
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
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-assetId">资产Id</label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-assetId" :readonly="2==sign" v-model="currObj.AssetId" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-totalCirculation">发行量</label>
                        <div class="col-md-6 col-sm-6">
                           <input type="number" class="form-control" id="curr-totalCirculation" v-model="currObj.TotalCirculation" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-minTxVolume">最小交易量<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-minTxVolume" v-model="currObj.MinTxVolume" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label custom-label" for="curr-minTxVolume">区块链浏览器地址<span>*</span></label>
                        <div class="col-md-6 col-sm-6">
                           <input type="text" class="form-control" id="curr-minTxVolume" v-model="currObj.ExplorerUrl" />
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
                  <form enctype="multipart/form-data" id="upload-img" method="post">
                     <input type="file" name="upfile" id="upload-pic" @change="imgFn" />
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="operateCurrency()">
                     <span v-show="1==sign">添加</span><span v-show="2==sign">修改</span>
                  </a>
               </div>
            </div>
         </div>
      </div>
      <!-- 添加币种 -->

      <!-- 锁定/解锁 -->
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
                        <label class="col-md-4 control-label custom-label">Id</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="currObj.Id" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toLock()"><span v-show="3==sign">锁定</span><span v-show="4==sign">解锁</span></a>
               </div>
            </div>
         </div>
      </div>
      <!-- 锁定/解锁 -->

      <!-- 提醒门槛 -->
      <div class="modal fade" id="curr-notice">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-show="5==sign">修改余额通知金额</span><span v-show="6==sign">修改充值通知金额</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">Id</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="currObj.Id" readonly />
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
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="modifyNotifyLine()">提交</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 提醒门槛 -->
   </div>
</template>
<script>
   import '../../assets/css/reset'
   import Custom from 'custom'
   import Page from 'page'
   import 'jForm'
   //import Test from './test'
   export default {
      name: 'currency',
      data(){
         return {
            search: {queryText: '',pageIndex: 1,pageSize: 10},
            currObj: {IsVirtualCoin: false,IsBasicCoin: false},
            cgObj: {transferType: 1,fromAddress: '',toAddress: '',volume: 0,fee: 0,txNo: '',remark: ''},
            item: -1,
            items: [],
            sign: 1,
            total: 0,
            totalItems: 0,
            flag: false
         }
      },
      mounted(){
         var vm = this;

         vm.getCurrencyList();
         // 显示弹层
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一种货币";
            /*if(vm.item != -1){
               for(var i =0;i<vm.items.length;i++){
                  if(vm.item == vm.items[i].Id){
                     vm.currObj = vm.items[i];
                  }
               }
            }*/
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
            }else if('currency-balance' == _id){
               vm.sign = 5;
               if(vm.IsSelected(title,info)){
                  $('#curr-notice').modal('show');
               }
            }else if('currency-deposit' == _id){
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
            }else if('currency-hardTransfer' == _id){
               vm.sign = 9;
               if(vm.IsSelected(title,info)){
                  $('#curr-transfer').modal('show');
               }
            }
         });

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            /*Custom.resetForms($('form'));
            $('table>tbody>tr').each(function(){
               $(this).removeClass('warning');
            });
            for(var i =0;i<vm.items.length;i++){
               if(vm.item == vm.items[i].Id){
                  vm.currObj = vm.items[i];
               }
            }
            vm.item = -1;*/
            if(1==vm.sign){
               vm.currObj = {IsVirtualCoin: false,IsBasicCoin: false};
            }else if(7==vm.sign || 8== vm.sign){
               vm.cgObj = {fromAddress: '',toAddress: '',volume: 0,fee: 0,txNo: '',remark: ''};
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
      watch: {
         'search.beginDate'(cur,old){
            this.getCurrencyList();
         },
         'search.endDate'(cur,old){
            this.getCurrencyList();
         }
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
         operateCurrency: function(){
            var vm = this,url='/Currency/Create';
            if(1==vm.sign){
               if(vm.currObj && vm.currObj.DepositFeeRate){vm.currObj.DepositFeeRate = (vm.currObj.DepositFeeRate * 0.01).toFixed(2);}
               if(vm.currObj && vm.currObj.WithdrawFeeRate){vm.currObj.WithdrawFeeRate = (vm.currObj.WithdrawFeeRate * 0.01).toFixed(2);}
               if(vm.currObj && vm.currObj.Id){delete vm.currObj.Id;}
            }else{
               url ='/Currency/Modify';
            }

            Custom.ajaxFn(url,{
               data: vm.currObj,
               vm: vm,
               callback: function(res){
                  var msg = '添加成功！';
                  if(res.IsSuccess){
                     if(1==vm.sign){
                        vm.currObj = {IsVirtualCoin: false,IsBasicCoin: false};
                     }
                     vm.getCurrencyList();
                     $('#curr-addModify').modal('hide');
                  }else{
                     msg = '添加失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 锁定/解锁
         toLock: function(){
            var vm = this,
               url = '/Currency/Lock';
            if(4==vm.sign){
               url = '/Currency/Unlock';
            }
            Custom.ajaxFn(url,{
               data: {id: vm.currObj.Id},
               vm: vm,
               callback: function(res){
                  var msg = '锁定成功！';
                  if(4==vm.sign){
                     msg = '解锁成功！';
                  }
                  if(res.IsSuccess){
                     vm.getCurrencyList();
                     $('#curr-lock').modal('hide');
                  }else{
                     msg = '锁定失败，'+res.ErrorMsg;
                     if(4==vm.sign){
                        msg = '解锁失败，'+res.ErrorMsg;
                     }
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 修改余额/充值提醒门槛
         modifyNotifyLine: function(flag){
            var vm = this,
               url = '/Currency/ModifyBalanceNotifyLine',data = {Id: vm.currObj.Id,amount: vm.currObj.BalanceNotifyLine};

            if(6==vm.sign){
               url = '/Currency/ModifyDepositNotifyLine';
               data.amount = vm.currObj.DepositNotifyLine;
            }
            Custom.ajaxFn(url,{
               data: data,
               vm: vm,
               callback: function(res){
                  var msg = '修改成功！';
                  if(6==vm.sign){
                     msg = '提醒成功！';
                  }
                  if(res.IsSuccess){
                     vm.getCurrencyList();
                     $('#curr-notice').modal('hide');
                  }else{
                     msg = '修改失败，'+res.ErrorMsg;
                     if(6==vm.sign){
                        msg = '提醒失败，'+res.ErrorMsg;
                     }
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败,'+res.statusText,index: -1});
               }
            });
         },
         // 冷钱包操作
         toTransferTo: function(){
            var vm = this,type=1;
            vm.cgObj.id = vm.currObj.Id;
            if(8==vm.sign){
               type = 2;
            }else if(9==vm.sign){
               type = 3;
            }
            vm.cgObj.transferType = type;
            Custom.ajaxFn('/Currency/TransferTo',{
               data: vm.cgObj,
               vm: vm,
               callback: function(res){
                  var msg = '操作成功！';
                  if(res.IsSuccess){
                     vm.cgObj = {transferType: 1,fromAddress: '',toAddress: '',volume: 0,fee: 0,txNo: '',remark: ''};
                     vm.getCurrencyList();
                     $('#curr-transfer').modal('hide');
                  }else{
                     msg = '操作失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取币种列表
         getCurrencyList: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/GetList',{
               data: vm.search,
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.items = res.Data.Items;

                     vm.total = res.Data.TotalPage;
                     vm.totalItems = res.Data.TotalItems;
                     vm.search.pageIndex = res.Data.CurrentPage;
                  }else{
                     vm.items = [];
                  }
               },
               errorCallback: function(res){
                  vm.items = [];
                  //Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         pageFn: function(index){
            var vm = this;
            vm.search.pageIndex = index;
            vm.getCurrencyList();
         },
         // 请选择一个管理员
         IsSelected: function(title,txt){
            var vm = this;
            
            return Custom.isSelected({title: title,txt: txt,index: vm.item});
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
                     vm.currObj.ImageUrl = res.url;
                     $('#upload-img')[0].reset();
                     vm.flag = false;
                  }
               }
            });
         }
      },
      components:{
         Page
      },
      replace: true
   }
</script>