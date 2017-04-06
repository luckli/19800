<template>
   <div id="content" class="content">
      <h1 class="page-header">虚拟待审核提现记录列表 <small>虚拟币提现记录维护</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">虚拟币待审核提现记录列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-6 col-md-6 manage-btns">
                     <button class="btn btn-inverse" id="coin-cashLog">审核提现记录</button>
                  </div>
                  <form class="col-xs-6 col-md-6 form-inline text-right">
                     <div class="form-group">
                        <label for="">币种</label>
                        <select v-model="search.currencyId" class="form-control input-sm" @change="getCoinList()">
                           <option v-for="type in CTypeList" :value="type">{{type}}</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <input type="text" class="form-control input-sm" v-model="search.queryText" @input="getCoinList()" placeholder="输入email或userId进行搜索..." />
                     </div>
                     <div class="input-daterange input-group group-date" id="datepicker">
                        <input type="text" class="input-sm form-control date-range" placeholder="开始时间" readonly />
                        <span class="input-group-addon">to</span>
                        <input type="text" class="input-sm form-control date-range" placeholder="结束时间" readonly />
                     </div>
                  </form>
                  <div class="clearfix"></div>
                  <table id="cashCoin-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>姓名</th>
                           <th>Email</th>
                           <th>请求金额</th>
                           <th>实际金额</th>
                           <th>手续费</th>
                           <th>第三方手续费</th>
                           <th>地址</th>
                           <th>状态</th>
                           <th>创建日期</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.UserName}}</td>
                           <td>{{item.Email}}</td>
                           <td>{{item.Amount}}</td>
                           <td>{{item.TxAmount}}</td>
                           <td>{{item.Fee}}</td>
                           <td>{{item.TxFee}}</td>
                           <td>{{item.Address}}</td>
                           <td><span v-if="1 == item.Status">未处理</span>
                              <span v-if="2 == item.Status">验证失败</span>
                              <span v-if="3 == item.Status">等待审核</span>
                              <span v-if="4 == item.Status">处理中</span>
                              <span v-if="5 == item.Status">完成</span>
                              <span v-if="6 == item.Status">处理失败</span>
                              <span v-if="7 == item.Status">取消</span>
                           </td>
                           <td>{{item.CreatedAt}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="10" style="text-align: center;">无数据</td>
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
      <!-- 审核通过 -->
      <div class="modal fade" id="cash-ok">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认要通过审核吗？？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">审核Id</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="item" readonly />
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
      <!-- 审核通过 -->
   </div>
</template>
<script>
   import '../../assets/lib/datepicker'
   import '../../assets/lib/bootstrap-datepicker'
   import Custom from 'custom'
   import Page from 'page'
   export default{
      name: 'coinCash',
      data(){
         return {
            items: [],
            item: -1,
            CTypeList: [],
            total: 0,
            totalItems: 0,
            search: {currencyId: '',queryText: '',beginDate: '',endDate: '',pageIndex: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         vm.getCurrencyTypeList();

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
            //vm.getCoinList();
         });

         // 显示弹层
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('id');
            if('coin-cashLog' == _id){
               if(vm.IsSelected('提示','请选择需要完成提现记录')){
                  $('#cash-ok').modal('show');
               }
            }
         });

         Custom.selectItem('#cashCoin-table',vm.item,function(res){
            vm.item = res;
         });
      },
      watch: {
         'search.beginDate'(cur,old){
            this.getCoinList();
         },
         'search.endDate'(cur,old){
            this.getCoinList();
         }
      },
      methods:{
         // 审核通过
         toAudit: function(){
            var vm = this;

            Custom.ajaxFn('/CoinWithdraw/Audit',{
               data: {withrawId: vm.item},
               vm: vm,
               callback: function(res){
                  var msg = '审核通过！';
                  if(res.IsSuccess){
                  }else{
                     msg = '审核失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
                  $('#cash-ok').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败，'+res.statusText,index: -1});
               }
            });
         },
         // 虚拟币提现列表
         getCoinList: function(){
            var vm = this;

            if((vm.search.beginDate && ''!=vm.search.beginDate) &&(vm.search.endDate && ''!=vm.search.endDate)){
               Custom.ajaxFn('/CoinWithdraw/GetPendingList',{
                  data: vm.search,
                  vm: vm,
                  callback: function(res){
                     if(res.IsSuccess){
                        var list = res.Data.Items;
                        for(var i = 0;i<list.length;i++){
                           list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                        }
                        vm.items = list;

                        vm.total = res.Data.TotalPage;
                        vm.search.pageIndex = res.Data.CurrentPage;
                        vm.totalItems = res.Data.TotalItems;
                     }
                  },
                  errorCallback: function(res){
                     Custom.isSelected({title: '提示',txt: '获取失败，'+res.statusText,index: -1});
                  }
               });
            }
         },
         // 获取币种列表
         getCurrencyTypeList: function(){
            var vm = this;

            Custom.ajaxFn('/Currency/VirtualList',{
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.CTypeList = res.Data;
                     vm.search.currencyId = res.Data[0];

                     vm.getCoinList();
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         pageFn: function(index){
            var vm = this;
            vm.search.pageIndex = index;
            vm.getCoinList();
         },
         // 请选择一个id
         IsSelected: function(title,txt){
            var vm = this;
            
            return Custom.isSelected({title: title,txt: txt,index: vm.item});
         }
      },
      components:{
         Page
      },
      replace:true
   }
</script>