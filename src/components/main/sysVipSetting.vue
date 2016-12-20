<template>
   <div id="content" class="content">
      <h1 class="page-header">Vip设置 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">Vip设置</h4></div>
               <div class="panel-body">
                  <div class="manage-btns">
                     <button class="btn btn-inverse" data-id="buz-set">设置</button>
                  </div>
                  <div class="clearfix"></div>
                  <table id="vip-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>VIP等级</th>
                           <th>提现折扣率</th>
                           <th>充值折扣率</th>
                           <th>交易手续费</th>
                           <th>更新日期</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.VipLevel}}</td>
                           <td>{{item.WithdrawRate}}</td>
                           <td>{{item.DepositRate}}</td>
                           <td>{{item.TradeRate}}</td>
                           <td>{{item.UpdatedAt}}</td>
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
      <!-- 设置 -->
      <div class="modal fade" id="mod-vip">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">设置提现、充值、交易的手续费的折扣率</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">Id</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="item" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">提现折扣率</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="obj.withdrawRate" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">充值折扣率</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="obj.depositRate" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">交易手续费</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="obj.tradeRate" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="setRate()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 设置 -->
   </div>
</template>
<script>
   import Custom from 'custom'
   export default{
      name: 'extra',
      data(){
         return{
            items: [],
            item: -1,
            obj: {id: '',withdrawRate: '',depositRate: '',tradeRate: ''}
         }
      },
      mounted(){
         var vm = this;

         vm.getVipList();

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个vip";
            if('buz-set' == _id){
               if(vm.IsSelected(title,info)){
                  $('#mod-vip').modal('show');
               }
            }
         });

         Custom.selectItem('#vip-table',vm.item,function(res){
            vm.item = res;

            for(var i = 0;i<vm.items.length;i++){
               if(res == vm.items[i].Id){
                  vm.obj.id = vm.items[i].Id;
                  vm.obj.withdrawRate = vm.items[i].WithdrawRate;
                  vm.obj.depositRate = vm.items[i].DepositRate;
                  vm.obj.tradeRate = vm.items[i].TradeRate;
               }
            }
         });
      },
      methods: {
         // 设置提现、充值、交易的手续费的折扣率
         setRate: function(){
            var vm = this;

            Custom.ajaxFn('/VipFee/SetRate',{
               data: vm.obj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getVipList();
                  }
                  $('#mod-vip').modal('hide');
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取VIP等级费率列表
         getVipList: function(){
            var vm = this;

            Custom.ajaxFn('/VipFee/GetList',{
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data;
                     for(var i = 0;i<list.length;i++){
                        list[i].UpdatedAt = Custom.dateTimeFormatter(list[i].UpdatedAt);
                     }
                     vm.items = list;
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