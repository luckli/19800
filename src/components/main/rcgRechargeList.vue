<template>
   <div id="content" class="content">
      <h1 class="page-header">充值码列表 <small>充值码列表</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">充值码列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="recharge-generate">生成充值码</button>
                     <button class="btn btn-inverse" data-id="recharge-destroy">销毁充值码</button>
                     <button class="btn btn-inverse" data-id="recharge-mngDestroy" v-if="!flag2">管理员销毁充值码</button>
                     <!-- <button class="btn btn-inverse" data-id="recharge-csOnlySeeMyself">查看自己的充值码</button> -->
                  </div>
                  <div class="col-xs-4 col-md-4 radio-status text-right">
                     <label><input type="radio" name="status" value="0" v-model="search.status" @change="getCodeList()" /><span>全部</span></label>
                     <label><input type="radio" name="status" value="1" v-model="search.status" @change="getCodeList()" /><span>未使用</span></label>
                     <label><input type="radio" name="status" value="2" v-model="search.status" @change="getCodeList()" /><span>已使用</span></label>
                     <label><input type="radio" name="status" value="3" v-model="search.status" @change="getCodeList()" /><span>已销毁</span></label>
                  </div>
                  <div class="clearfix"></div>
                  <table id="account-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>Id</th>
                           <th>户名</th>
                           <th>金额</th>
                           <th>状态</th>
                           <th>创建人</th>
                           <th>创建日期</th>
                           <th>使用时间</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.Id">
                           <td>{{item.Id}}</td>
                           <td>{{item.UserName}}</td>
                           <td>{{item.Amount}}</td>
                           <td><span v-if="1==item.Status">未使用</span><span v-if="2==item.Status">已使用</span><span v-if="3==item.Status">已销毁</span> {{item.Code}}-{{item.Password}}</td>
                           <td>{{item.CreatedBy}}</td>
                           <td>{{item.CreatedAt}}</td>
                           <td>{{item.UsedAt}}</td>
                        </tr>
                        <tr v-if="0 == items.length">
                           <td colspan="7" style="text-align: center;">无数据</td>
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
      <!-- 生成充值码 -->
      <div class="modal fade" id="rcg-generate">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">生成充值码</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">资金来源ID<span>*</span></label>
                        <div class="col-md-6">
                           <select v-model="genObj.capitalAccountId" class="form-control">
                              <option v-for="bank in banks" :value="bank.Id">{{bank.AccountNumber}}</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">充值码金额<span>*</span></label>
                        <div class="col-md-6">
                           <input type="number" class="form-control" v-model="genObj.amount" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">充值码密码<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="genObj.password" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="generateCode()">生成</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 生成充值码 -->

      <!-- 销毁充值码 -->
      <div class="modal fade" id="rcg-destroy">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认要销毁该充值码吗？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">资金来源ID<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="item" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="destroyCode()">销毁</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 销毁充值码 -->

   </div>
</template>
<script>
   import Custom from 'custom'
   import Page from 'page'
   export default{
      name: 'rcgList',
      data(){
         return{
            item: -1,
            sign: 1,
            total: 0,
            totalItems: 0,
            genObj: {capitalAccountId: '',amount: 0,password: ''},
            search: {status: 0,pageIndex: 1,pageSize: 10},
            banks: [],
            items: [],
            flag: false
         }
      },
      mounted(){
         var vm =this;

         if(vm.$route.params.Id){
            vm.flag = true;
         }
         vm.getCodeList();
         Custom.selectItem('#account-table',vm.item,function(res){
            vm.item = res;
         });
         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            vm.genObj = {capitalAccountId: '',amount: 0,password: ''};
         });
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择需要销毁的充值码";
            if('recharge-generate' == _id){
               if(0 == vm.banks.length){
                  vm.getCapitalAccount();
               }
               $('#rcg-generate').modal('show');
            }else if('recharge-destroy' == _id){
               vm.sign = 1;
               if(vm.IsSelected(title,info)){
                  $('#rcg-destroy').modal('show');
               }
            }else if('recharge-mngDestroy' == _id){
               vm.sign = 2;
               if(vm.IsSelected(title,info)){
                  $('#rcg-destroy').modal('show');
               }
            }
         });
      },
      computed:{
         flag2: function(){
            var vm = this;
            if(vm.$route.params.Id){
               vm.flag=true;
               
            }else{
               vm.flag=false;
            }
            return vm.flag;
         }
      },
      watch:{
         'flag2'(cur,old){
            var vm = this;
            vm.getCodeList();
         }
      },
      methods:{
         // 管理员查看所有充值码
         getCodeList: function(){
            var vm = this,url = '/Deposit/GetCodeList';
            if(vm.flag2){
               url = '/Deposit/GetMyCodeList'
            }
            Custom.ajaxFn(url,{
               data: vm.search,
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreatedAt = Custom.dateTimeFormatter(list[i].CreatedAt);
                        list[i].UsedAt = Custom.dateTimeFormatter(list[i].UsedAt);
                     }
                     vm.items = list;

                     vm.total = res.Data.TotalPage;
                     vm.totalItems = res.Data.TotalItems;
                     vm.search.pageIndex = res.Data.CurrentPage;
                  }
               },
               errorCallback: function(res){
                  vm.items = [];
                  Custom.isSelected({title: '提示',txt: '查看失败，'+res.statusText,index: -1});
               }
            });
         },
         // 获取资金账号列表
         getCapitalAccount: function(){
            var vm = this;

            Custom.ajaxFn('/CapitalAccount/List',{
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.banks = res.Data;
                     vm.genObj.capitalAccountId = vm.banks[0].Id;
                  }
               },
               errorCallback: function(res){
                  vm.banks = [];
                  Custom.isSelected({title: '提示',txt: '查看失败，'+res.statusText,index: -1});
               }
            });
         },
         // 生成充值码
         generateCode: function(){
            var vm = this;

            Custom.ajaxFn('/Deposit/GenerateCode',{
               data: vm.genObj,
               vm: vm,
               callback: function(res){
                  var msg = '生成成功！';
                  if(res.IsSuccess){
                     vm.getCodeList();
                     $('#rcg-generate').modal('hide');
                  }else{
                     msg = '生成失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '查看失败，'+res.statusText,index: -1});
               }
            });
         },
         // 销毁充值码
         destroyCode: function(){
            var vm = this,url = '/Deposit/DestroyCode';
            if(vm.flag2){
               url = '/Deposit/DestroyMyCode';
            }
            Custom.ajaxFn(url,{
               data: {depositCodeId: vm.item},
               vm: vm,
               callback: function(res){
                  var msg = '销毁成功！';
                  if(res.IsSuccess){
                     vm.getCodeList();
                  }else{
                     msg = '销毁失败，'+res.ErrorMsg;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
                  $('#rcg-destroy').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '操作失败，'+res.statusText,index: -1});
               }
            });
         },
         pageFn: function(index){
            var vm = this;
            vm.search.pageIndex = index;
            vm.getCodeList();
         },
         // 请选择一个管理员
         IsSelected: function(title,txt){
            var vm = this;
            
            return Custom.isSelected({title: title,txt: txt,index: vm.item});
         }
      },
      components:{
         Page
      },
      replace: true
   }
</script>