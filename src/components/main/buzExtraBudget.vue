<template>
   <div id="content" class="content">
      <h1 class="page-header">额外收支查询 <small>人民币额外收支查询</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">额外收支查询</h4></div>
               <div class="panel-body">
                  <div class="manage-btns">
                     <button class="btn btn-inverse" data-id="buz-coolWallet" v-if="2==tab">冷钱包</button>
                     <button class="btn btn-inverse" data-id="buz-hotWallet" v-if="2==tab">热钱包</button>
                     <button class="btn btn-inverse" data-id="buz-transFrom" v-if="1==tab">账号转入</button>
                     <button class="btn btn-inverse" data-id="buz-transferTo" v-if="1==tab">账户转出</button>
                  </div>
                  <div class="clearfix"></div>
                  <ul class="tabs table-box col-xs-4 col-md-4" @click="tabFn($event)">
                    <li :class="{'active': 1==tab}">资金账号的转账记录</li>
                    <li :class="{'active': 2==tab}">热冷钱包的转账记录</li>
                  </ul>
                  <div class="col-xs-8 col-md-8 search form-inline text-right">
                     <div class="form-group" v-show="2==tab">
                        <label for="">币种</label>
                        <select class="form-control input-sm" v-model="search.currencyId" @change="getPageList()">
                           <option v-for="type in CTypeList" :value="type.Code">{{type.Code}}</option>
                        </select>
                     </div>
                     <div class="form-group" v-show="1==tab">
                        <label for="">资金账户</label>
                        <select class="form-control input-sm" v-model="search.capitalAccountId" @change="getPageList()">
                           <option v-for="bank in banks" :value="bank.Id">{{bank.AccountNumber}}</option>
                        </select>
                     </div>
                     <div class="input-daterange input-group group-date" id="datepicker">
                        <input type="text" class="input-sm form-control date-range" placeholder="开始时间" v-model="search.beginDate" @change="getPageList()" readonly />
                        <span class="input-group-addon">to</span>
                        <input type="text" class="input-sm form-control date-range" placeholder="结束时间" v-model="search.endDate" @change="getPageList()" readonly />
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="budget-table" class="table table-striped table-bordered" v-show="2==tab">
                     <thead>
                        <tr>
                           <th>币种</th>
                           <th>交易类型</th>
                           <th>转入地址</th>
                           <th>冷钱包地址</th>
                           <th>金额</th>
                           <th>交易码</th>
                           <th>备注</th>
                           <th>创建时间</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="wallet in wallets" :data-id="wallet.Id">
                           <td>{{wallet.CurrencyId}}</td>
                           <td>{{wallet.TransferDirection}}</td>
                           <td>{{wallet.TargetAddress}}</td>
                           <td>{{wallet.ColdAddress}}</td>
                           <td>{{wallet.Amount}}</td>
                           <td>{{wallet.TxNo}}</td>
                           <td>{{wallet.Remark}}</td>
                           <td>{{wallet.CreatedAt}}</td>
                        </tr>
                        <tr v-if="0 == wallets.length">
                           <td colspan="8" style="text-align: center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
                  <table id="budget-table" class="table table-striped table-bordered" v-show="1==tab">
                     <thead>
                        <tr>
                           <th>转账方向</th>
                           <th>资金账号银行信息</th>
                           <th>另一个账号银行信息</th>
                           <th>转账金额</th>
                           <th>转账流水号</th>
                           <th>备注</th>
                           <th>转账日期</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td><span v-if="1==item.TxType">转入</span><span v-if="2==item.TxType">转出</span></td>
                           <td><span class="bold">户名：</span>{{item.OwnerName}}<br />
                              <span class="bold">账号：</span>{{item.AccountNumber}}<br />
                              <span class="bold">银行名称：</span>{{item.BankName}}<br />
                              <span class="bold">支行：</span>{{item.Subbranch}}
                           </td>
                           <td><span class="bold">户名：</span>{{item.TxBankName}}<br />
                              <span class="bold">账号：</span>{{item.TxAccountNumber}}<br />
                              <span class="bold">银行名称：</span>{{item.TxOwnerName}}<br />
                              <span class="bold">支行：</span>{{item.TxSubbranch}}
                           </td>
                           <td>{{item.Amount}}</td>
                           <td>{{item.TxNo}}</td>
                           <td>{{item.Remark}}</td>
                           <td>{{item.CreatedAt}}</td>
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
      <!-- 冷热钱包 -->
      <div class="modal fade" id="mod-wallet" @keyup.enter="toWallet()">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-if="1==sign">转入冷钱包</span><span v-if="2==sign">转入热钱包</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">币种</label>
                        <div class="col-md-6">
                           <select class="form-control input-sm" v-model="obj.code">
                              <option v-for="type in CTypeList" :value="type.Code">{{type.Code}}</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">冷钱包地址</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="obj.coldAddress" />
                        </div>
                     </div>
                     <div class="form-group" v-if="2==sign">
                        <label class="col-md-4 control-label custom-label">热钱包地址</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="obj.hotAddress" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">转入金额</label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" v-model="obj.volume" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">转账流水号</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="obj.txNo" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">备注</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="obj.remark" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toWallet()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 冷热钱包 -->

      <!-- 资金账户转入/转出 -->
      <div class="modal fade" id="mod-transfer" @keyup.enter="accountTransfer()">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-if="3==sign">资金账户转入</span><span v-if="4==sign">资金账户转出</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">资金账户Id<span>*</span></label>
                        <div class="col-md-6">
                           <select class="form-control input-sm" v-model="accObj.capitalAccountId">
                              <option v-for="bank in banks" :value="bank.Id">{{bank.AccountNumber}}</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">姓名<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="accObj.ownerName" placeholder="请输入姓名" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">账号<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="accObj.accountNumber" placeholder="请输入账号号码" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">银行类型<span>*</span></label>
                        <div class="col-md-6">
                           <select class="form-control input-sm" v-model="accObj.accountType">
                              <option v-for="list in accountList" :value="list.Id">{{list.BankName}}</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">银行支行<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="accObj.subbranch" placeholder="请输入银行支行" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">金额<span>*</span></label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" v-model="accObj.amount" placeholder="请输入转账金额" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">转账流水号<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="accObj.txNo" placeholder="请输入转账流水号" />
                        </div>
                     </div>
                     <div class="form-group" v-if="4==sign">
                        <label class="col-md-4 control-label custom-label">手续费<span>*</span></label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" v-model="accObj.txFee" placeholder="请输入手续费" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">备注<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="accObj.remark" placeholder="请输入备注" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="accountTransfer()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 资金账户转入/转出 -->
   </div>
</template>
<script>
   import '../../assets/lib/datepicker'
   import '../../assets/lib/bootstrap-datepicker'
   import Custom from 'custom'
   export default{
      name: 'extra',
      data(){
         return {
            items: [],
            wallets: [],
            CTypeList: [],
            accountList: [],
            sign: 1,
            tab: 1,
            accObj: {capitalAccountId: '',ownerName: '',accountType: '',subbranch: '',accountNumber: '',amount: '',txNo: '',txFee: '',remark: ''},
            obj: {code: '',coldAddress: '',hotAddress: '',volume: '',txNo: '',remark: ''},
            search: {currencyId: '',capitalAccountId: '',beginDate: '',endDate: '',pageIndex: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         vm.getCapitalAccount();

         $('.group-date').datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd'
         }).on('changeDate',function(ev){
            var count = 0;
            $('.group-date input').each(function(){
               if(count == 0){
                  vm.search.beginDate = $(this).val();
               }else if(count == 1){
                  vm.search.endDate = $(this).val();
               }
               count ++;
            });
            vm.getPageList();
         });

         Custom.selectItem('#budget-table',vm.item,function(res){
            vm.item = res;
         });

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个收支记录";
            if('buz-coolWallet' == _id){
               vm.sign = 1;
               $('#mod-wallet').modal('show');
            }else if('buz-hotWallet' == _id){
               vm.sign = 2;
               $('#mod-wallet').modal('show');
            }else if('buz-transFrom' == _id){
               if(0==vm.accountList.length){
                  vm.getPayTypeList();
               }
               vm.sign = 3;
               $('#mod-transfer').modal('show');
            }else if('buz-transferTo' == _id){
               if(0==vm.accountList.length){
                  vm.getPayTypeList();
               }
               vm.sign = 4;
               $('#mod-transfer').modal('show');
            }
         });

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            if(1==vm.sign || 2==vm.sign){
               vm.obj = {code: 0<vm.CTypeList.length?vm.CTypeList[0].Code:'',coldAddress: '',hotAddress: '',volume: '',txNo: '',remark: ''};
            }else{
               vm.accObj = {capitalAccountId: 0<vm.banks.length?vm.banks[0].Id:'',ownerName: '',accountType: 0<vm.accountList.length?vm.accountList[0].Id:'',subbranch: '',accountNumber: '',amount: '',txNo: '',txFee: '',remark: ''};
            }
         });
      },
      methods:{
         // 转入冷/热钱包
         toWallet: function(){
            var vm = this,url = '';
            if(1==vm.sign){
               url = '/Currency/TransferTo';
               vm.$delete(vm.obj,'hotAddress');
            }else{
               url = '/Currency/AcceptTransferFrom';
            }

            Custom.ajaxFn(url,{
               data: vm.obj,
               callback: function(res){
                  if(res.IsSuccess){
                     if(1==vm.tab){
                        vm.getPageList();
                     }else{
                        vm.getAccountTransferList();
                     }
                  }else{
                     Custom.isSelected({title: '提示',txt: '转入钱包失败,'+res.ErrorMsg,index: -1});
                  }
                  $('#mod-wallet').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 资金账户转入/转出
         accountTransfer: function(){
            var vm = this,url = "",data = {};
            if(3==vm.sign){
               url = '/CapitalAccount/AcceptTransferFrom';
               data = {capitalAccountId: vm.accObj.capitalAccountId,fromOwnerName: vm.accObj.ownerName,fromAccountType: vm.accObj.accountType,fromSubbranch: vm.accObj.subbranch,fromAccountNumber: vm.accObj.accountNumber,amount: vm.accObj.amount,txNo: vm.accObj.txNo,remark: vm.accObj.remark};
            }else if(4==vm.sign){
               url = '/CapitalAccount/TransferTo';
               data = {capitalAccountId: vm.accObj.capitalAccountId,toOwnerName: vm.accObj.ownerName,toAccountType: vm.accObj.accountType,toSubbranch: vm.accObj.subbranch,toAccountNumber: vm.accObj.accountNumber,amount: vm.accObj.amount,txNo: vm.accObj.txNo,txFee: vm.accObj.txFee,remark: vm.accObj.remark};
            }

            Custom.ajaxFn(url,{
               data: data,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: '获取币种列表失败,'+res.ErrorMsg,index: -1});
                  }
                  $('#mod-transfer').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取资金账户的转账/币种的冷热钱包的转账记录列表
         getPageList: function(){
            var vm = this,url = '',data = {};
            data = JSON.parse(JSON.stringify(vm.search));
            if(1==vm.tab){
               url = '/CapitalAccount/GetTransferList';
               delete data.currencyId;
            }else if(2==vm.tab){
               url = '/Currency/GetTransferList';
               delete data.capitalAccountId;
            }
            Custom.ajaxFn(url,{
               data: data,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     if(1==vm.tab){
                        vm.items = list;
                     }else if(2==vm.tab){
                        vm.wallets = list;
                     }
                  }else{
                     Custom.isSelected({title: '提示',txt: '获取币种列表失败,'+res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取币种列表
         getCurrencyTypeList: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/GetList',{
               data: {queryText: '',pageIndex: 1,pageSize: 100},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.CTypeList = res.Data.Items;
                     vm.search.currencyId = res.Data.Items[0].Code;
                     vm.obj.code = res.Data.Items[0].Code;
                  }else{
                     Custom.isSelected({title: '提示',txt: '获取币种列表失败,'+res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取付款账号类型列表
         getPayTypeList: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/GetPayTypeList',{
               callback: function(res){
                  if(res.IsSuccess){
                     vm.accountList = res.Data;
                     if(0<res.Data.length){
                        vm.accObj.accountType = res.Data[0].Id
                     }else{
                        Custom.isSelected({title: '提示',txt: '获取付款账号类型失败,'+res.ErrorMsg,index: -1});
                     }
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
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
                     vm.accObj.capitalAccountId = vm.banks[0].Id;
                     vm.search.capitalAccountId = vm.banks[0].Id;
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: '获取资金账号列表失败,'+res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  vm.banks = [];
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // tab切换
         tabFn: function(e){
            e = e || window.event;
            var vm = this,$li = $('.tabs>li');

            if($li.get(0) == e.target){
               vm.tab = 1;
               if(0<vm.banks.length){
                  vm.search.capitalAccountId = vm.banks[0].Id;
               }
               if(0<vm.items.length){
                  vm.getPageList();
               }
            }else if($li.get(1) == e.target){
               vm.tab = 2;
               if(0==vm.CTypeList.length){
                  vm.getCurrencyTypeList();
               }
               if(0<vm.CTypeList.length){
                  vm.search.currencyId = vm.CTypeList[0].Code;
               }
               if(0<vm.wallets.length){
                  vm.getPageList();
               }
            }
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
<style lang="less">
   .tabs{padding-left: 0;
      &:after{content: ''; display: table; clear: both;}
      >li{ border: 1px solid transparent; border-bottom: 0; border-top-left-radius: 5px; border-top-right-radius: 5px; color:#337ab7; cursor: pointer; float: left; padding: 10px 15px;
         &.active{ border-color:#ddd; color: #000; cursor: default;}
      }
   }
</style>