<template>
   <div id="content" class="content">
      <h1 class="page-header">Vip设置 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">Vip设置</h4></div>
               <div class="panel-body">
                  <div class="manage-btns">
                     <button class="btn btn-inverse" data-id="vip-add">增加</button>
                     <button class="btn btn-inverse" data-id="vip-modify">修改</button>
                     <button class="btn btn-inverse" data-id="vip-del">删除</button>
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
                           <td>{{item.VipName}}</td>
                           <td>{{item.WithdrawRate}}</td>
                           <td>{{item.DepositRate}}</td>
                           <td>{{item.TradeRate}}</td>
                           <td>{{item.UpdatedAt}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="5" style="text-align: center;">无数据</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 增加/修改 -->
      <div class="modal fade" id="mod-vip">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title"><span v-if="1==sign">增加</span><span v-else>修改</span></h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">Id</label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" placeholder="1-10，且不能与其他id重复" v-model="obj.id" :readonly="2==sign" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">vip标签</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" placeholder="vip名字" v-model="obj.vipName" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">提现折扣率</label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" placeholder="0.0" v-model="obj.withdrawRate" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">充值折扣率</label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" placeholder="0.0" v-model="obj.depositRate" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">交易手续费</label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" placeholder="0.0" v-model="obj.tradeRate" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="setRate()"><span v-if="1==sign">确定</span><span v-else>修改</span></a>
               </div>
            </div>
         </div>
      </div>
      <!-- 增加/修改 -->

      <!-- 删除 -->
      <div class="modal fade" id="mod-del">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">删除VIP</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">Id</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="item" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="delVip()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 删除 -->
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
            sign: 1,
            obj: {id: '',withdrawRate: '',depositRate: '',tradeRate: ''}
         }
      },
      mounted(){
         var vm = this;

         vm.getVipList();

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个vip";
            if('vip-add' == _id){
               vm.sign = 1;
               vm.obj = {id: '',withdrawRate: '',depositRate: '',tradeRate: ''};
               $('#mod-vip').modal('show');
            }else if('vip-modify' == _id){
               vm.sign = 2;
               if(vm.IsSelected(title,info)){
                  $('#mod-vip').modal('show');
               }
            }else if('vip-del' == _id){
               if(vm.IsSelected(title,info)){
                  $('#mod-del').modal('show');
               }
            }
         });

         Custom.selectItem('#vip-table',vm.item,function(res){
            vm.item = res;

            for(var i = 0;i<vm.items.length;i++){
               if(res == vm.items[i].Id){
                  vm.obj.id = vm.items[i].Id;
                  vm.obj.vipName = vm.items[i].VipName;
                  vm.obj.withdrawRate = vm.items[i].WithdrawRate;
                  vm.obj.depositRate = vm.items[i].DepositRate;
                  vm.obj.tradeRate = vm.items[i].TradeRate;
               }
            }
         });
      },
      methods: {
         // 增加/修改
         setRate: function(){
            var vm = this,
               url = '/UserVip/Add';
            if(2==vm.sign){
               url = '/UserVip/Update';
            }
            Custom.ajaxFn(url,{
               data: vm.obj,
               vm: vm,
               callback: function(res){
                  var msg = '增加成功！';
                  if(2==vm.sign){
                     msg = '修改成功！';
                  }
                  if(res.IsSuccess){
                     vm.getVipList();
                  }else{
                     msg = '增加失败，'+res.ErrorMsg;
                     if(2==vm.sign){
                        msg = '修改失败，'+res.ErrorMsg;
                     }
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
                  $('#mod-vip').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 删除vip
         delVip: function(){
            var vm = this;

            Custom.ajaxFn('/UserVip/Delete',{
               data: {id: vm.item},
               vm: vm,
               callback: function(res){
                  var msg = '删除成功！';
                  if(res.IsSuccess){
                     vm.getVipList();
                  }else{
                     msg = '删除失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
                  $('#mod-del').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取VIP等级费率列表
         getVipList: function(){
            var vm = this;

            Custom.ajaxFn('/UserVip/GetList',{
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data;
                     for(var i = 0;i<list.length;i++){
                        list[i].UpdatedAt = Custom.dateTimeFormatter(list[i].UpdatedAt);
                     }
                     vm.items = list;
                  }else{
                     Custom.isSelected({title: '提示',txt: '获取列表失败,'+res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
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