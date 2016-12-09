<template>
   <div id="content" class="content">
      <h1 class="page-header">用户列表 <small>系统注册用户查看、管理</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">用户列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="user-lock">锁定</button>
                     <button class="btn btn-inverse" data-id="user-dLock">普通解锁</button>
                     <button class="btn btn-inverse" data-id="user-fLock">强制解锁</button>
                     <button class="btn btn-inverse" data-id="user-relieveGugVali">解除谷歌身份验证</button>
                     <button class="btn btn-inverse" data-id="user-phoneUnlock">解除手机锁定</button>
                     <button class="btn btn-inverse" data-id="user-setUserVip">设置用户VIP等级</button>
                  </div>
                  <div class="clearfix"></div>
                  <table id="user-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>Id</th>
                           <th>邮箱</th>
                           <th>手机号码</th>
                           <th>Two Factor</th>
                           <th>创建日期</th>
                           <th>是否锁定</th>
                           <th>锁定类别</th>
                           <th>安全验证等级</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="list in uList" :data-id="list.Id">
                           <td>{{list.Id}}</td>
                           <td>{{list.Email}}</td>
                           <td>{{list.Phone}}</td>
                           <td>{{!!list.Phone ? '手机':'No'}}</td>
                           <td>2016-09-27 14:57:30</td>
                           <td><span v-if="1 == list.Status">未激活</span><span v-if="2 == list.Status">激活</span><span v-if="4 == list.Status">锁定</span><span v-if="5 == list.Status">未激活且被锁定</span><span v-if="6 == list.Status">激活被锁定</span></td>
                           <td><span v-if="0 == list.LockType">未锁定</span><span v-if="1 == list.LockType">管理员锁定</span><span v-if="4 == list.LockType">系统自动锁定</span><span v-if="8 == list.LockType">用户自己锁定</span><span v-if="16 == list.LockType">交易异常锁定</span><span v-if="(0 != list.LockType) && (1 != list.LockType) && (4 != list.LockType) && (8 != list.LockType) && (16 != list.LockType)">None</span></td>
                           <td>{{list.VerifyLevel}}</td>
                        </tr>
                     </tbody>
                  </table>
                  <div>
                     <label>显示第 <span>{{(pageObj.index*10)-9}}</span> 至 <span>{{pageObj.index*10}}</span> 项结果，共 <span>{{pageObj.items}}</span> 项</label>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <!-- 锁定 -->
      <div class="modal fade" id="user-lock">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">
                     <span v-show="1 == sign">确认要锁定吗？</span>
                     <span v-show="2 == sign || 3 == sign">确认解除锁定吗？</span>
                     <span v-show="4 == sign">确定要解除用户的谷歌身份验证吗？</span>
                     <span v-show="5 == sign">确定要解除用户的绑定手机吗？</span>
                     <span v-show="6 == sign">修改vip等级</span>
                  </h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="userObj.name" readonly />
                        </div>
                     </div>
                     <div class="form-group" v-if="6 == sign">
                        <label class="col-md-4 control-label custom-label">vip等级</label>
                        <div class="col-md-6">
                           <select v-model="vipId" class="form-control">
                              <option v-for="vip in vips" :value="vip.id">{{vip.val}}</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">备注</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" v-model="remark" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="1 == sign" @click="toLock()">锁定</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="2 == sign" @click="todLock()">解锁</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="3 == sign" @click="tofLock()">解锁</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="4 == sign" @click="toUnBindOtp()">确定</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="5 == sign" @click="toUnBindPhone()">解除</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" v-show="6 == sign" @click="toSetVipLevel()">确认</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 锁定 -->
   </div>
</template>
<script>
   import '../../assets/css/reset'
   import Custom from '../../assets/js/custom'
   export default {
      name: 'user',
      data(){
         return {
            item: -1,
            sign: 1,
            uList: [],
            vipId: -1,
            vips: [{id: -1,val:'请选择'},{id: 1,val:'Vip0'},{id: 2,val:'Vip1'},{id: 3,val:'Vip2'},{id: 4,val:'Vip3'},{id: 5,val:'Vip4'},{id: 6,val:'Vip5'},{id: 7,val:'Vip6'},{id: 8,val:'Vip7'},{id: 9,val:'Vip8'},{id: 10,val:'Vip9'},{id: 11,val:'Vip10'}],
            pageObj: {index: 1,size: 10,items: 0},
            remark: '',
            searchObj: {email: '',phone: '',id: ''},
            userObj: {name: ''}
         }
      },
      mounted(){
         var vm = this;

         Custom.selectItem('#user-table',vm.item,function(res){
            vm.item = res;

            for(var i =0;i<vm.uList.length;i++){
               if(res == vm.uList[i].Id){
                  vm.userObj.name = vm.uList[i].RealName;
                  vm.vipId = vm.uList[i].VipLevel;
               }
            }
         });

         vm.getUserList();

         // 关闭重置模态框
         $(".modal").on("hidden.bs.modal", function() {
            vm.userObj.name = '';
            vm.remark = '';
            vm.vipId = -1;
         });
         // 显示弹层
         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id'),title="提示",info = "请选择一个用户";

            for(var i =0;i<vm.uList.length;i++){
               if(vm.item == vm.uList[i].Id){
                  vm.userObj.name = vm.uList[i].RealName;
                  vm.vipId = vm.uList[i].VipLevel;
               }
            }
            if('user-lock' == _id){
               vm.sign = 1;
               if(vm.IsSelected(title,info)){
                  $('#user-lock').modal('show');
               }
            }else if('user-dLock' == _id){
               vm.sign = 2;
               if(vm.IsSelected(title,info)){
                  $('#user-lock').modal('show');
               }
            }else if('user-fLock' == _id){
               vm.sign = 3;
               if(vm.IsSelected(title,info)){
                  $('#user-lock').modal('show');
               }
            }else if('user-relieveGugVali' == _id){
               vm.sign = 4;
               if(vm.IsSelected(title,info)){
                  $('#user-lock').modal('show');
               }
            }else if('user-phoneUnlock' == _id){
               vm.sign = 5;
               if(vm.IsSelected(title,info)){
                  $('#user-lock').modal('show');
               }
            }else if('user-setUserVip' == _id){
               vm.sign = 6;
               if(vm.IsSelected(title,info)){
                  $('#user-lock').modal('show');
               }
            }
         });
      },
      methods:{
         // 锁定
         toLock: function(){
            var vm = this;

            Custom.ajaxFn('/User/Lock',{
               data: {id: vm.item,remark: vm.remark},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.remark = '';
                     vm.getUserList();
                     $('#user-lock').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 普通解锁
         todLock: function(){
            var vm = this;

            Custom.ajaxFn('/User/UnLock',{
               data: {id: vm.item,remark: vm.remark},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.remark = '';
                     vm.getUserList();
                     $('#user-lock').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 强制解锁
         tofLock: function(){
            var vm = this;

            Custom.ajaxFn('/User/MandatoryUnLock',{
               data: {id: vm.item,remark: vm.remark},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.remark = '';
                     vm.getUserList();
                     $('#user-lock').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 解绑谷歌
         toUnBindOtp: function(){
            var vm = this;

            Custom.ajaxFn('/User/UnBindOtp',{
               data: {id: vm.item,remark: vm.remark},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.remark = '';
                     vm.getUserList();
                     $('#user-lock').modal('hide');
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 解除手机绑定
         toUnBindPhone: function(){
            var vm = this;

            Custom.ajaxFn('/User/UnBindPhone',{
               data: {id: vm.item,remark: vm.remark},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.remark = '';
                     vm.getUserList();
                     $('#user-lock').modal('hide');
                  }else{
                     Custom.isSelected({title: title,txt: txt,index: -1})
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 设置会员等级
         toSetVipLevel: function(){
            var vm = this;

            if(-1 == vm.vipId){
               Custom.isSelected({title: '提示',txt: '请选择会员等级',index: -1});
               return false;
            }
            Custom.ajaxFn('/User/SetVipLevel',{
               data: {id: vm.item,level: vm.vipId,remark: vm.remark},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.remark = '';
                     vm.vipId = -1;
                     vm.getUserList();
                     $('#user-lock').modal('hide');
                  }else{
                     Custom.isSelected({title: title,txt: txt,index: -1});
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 获取用户列表
         getUserList: function(){
            var vm = this;
            
            Custom.ajaxFn('/User/GetPageList',{
               data: {email: vm.searchObj.email,phone: vm.searchObj.phone,id: vm.searchObj.id,page: vm.pageObj.index,pageSize: vm.pageObj.size},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.uList = res.Data.Items;
                     vm.pageObj.items = res.Data.TotalItems;
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