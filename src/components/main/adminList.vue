<template>
   <div id="content" class="content">
      <h1 class="page-header">管理员列表 <small>管理员维护及权限控制</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">管理员列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" id="manage-add" data-target="#mng-add" data-toggle="modal">添加管理员</button>
                     <button class="btn btn-inverse" id="manage-lock" data-target="#mng-lock" data-toggle="modal">锁定</button>
                     <button class="btn btn-inverse" id="manage-unlock" data-target="#mng-unlock" data-toggle="modal">解除锁定</button>
                     <button class="btn btn-inverse" id="manage-set-role" data-target="#mng-set-role" data-toggle="modal">设置角色</button>
                     <button class="btn btn-inverse" id="manage-lock-key" data-target="#mng-lock-key" data-toggle="modal">绑定密钥</button>
                     <button class="btn btn-inverse" id="manage-unbind-otp" data-target="#mng-unbind-otp" data-toggle="modal">解除谷歌otp绑定</button>
                     <button class="btn btn-inverse" id="manage-reset-pwd" data-target="#mng-reset-pwd" data-toggle="modal">重置登陆密码</button>
                  </div>
                  <div class="col-xs-4 col-md-4 dataTable-filter text-right">
                     <label for="input-filter">
                        <span>搜索</span>
                        <input type="text" class="form-control input-sm" id="input-filter" placeholder="输入登陆账号进行搜索..." />
                     </label>
                  </div>
                  <table id="manage-table" class="table table-striped table-bordered">
                     <thead>
                        <tr>
                           <th>登陆账号</th>
                           <th>是否锁定</th>
                           <th>角色</th>
                           <th>充值码额度</th>
                           <th>最后登陆IP</th>
                           <th>最后登陆时间</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td>admin</td>
                           <td>No</td>
                           <td>超级管理员,财务人员,财务主管,编辑</td>
                           <td>28,305.7200</td>
                           <td>116.226.69.241</td>
                           <td>2016-09-27 13:40:11</td>
                        </tr>
                        <tr>
                           <td>admin</td>
                           <td>No</td>
                           <td>超级管理员,财务人员,财务主管,编辑</td>
                           <td>28,305.7200</td>
                           <td>116.226.69.241</td>
                           <td>2016-09-27 13:40:11</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- 添加管理员  -->
      <div class="modal fade" id="mng-add">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">添加管理员</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="add-user">用户名<span>*</span></label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="add-user" placeholder="请输入用户名" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="add-pwd">密码<span>*</span></label>
                        <div class="col-md-6">
                           <input type="password" class="form-control" id="add-pwd" placeholder="请输入密码" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success">保存</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 添加管理员 -->

      <!-- 锁定 -->
      <div class="modal fade" id="mng-lock">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认要锁定吗？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" name="lock-user" readonly placeholder="请输入用户名" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success">锁定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 锁定 -->

      <!-- 解除锁定 -->
      <div class="modal fade" id="mng-unlock">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认要解除锁定吗？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" name="unlock-user" readonly placeholder="请输入用户名" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success">锁定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 解除锁定 -->

      <!-- 设置角色 -->
      <div class="modal fade" id="mng-set-role">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">设置角色</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" name="set-user" readonly placeholder="请输入用户名" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">角色<span>*</span></label>
                        <div class="col-md-6">
                           <ul>
                              <li><label><input type="checkbox" name="roles" /><span>FinancialStaff</span></label></li>
                              <li><label><input type="checkbox" name="roles" /><span>FinancialManager</span></label></li>
                              <li><label><input type="checkbox" name="roles" /><span>CustomerService</span></label></li>
                              <li><label><input type="checkbox" name="roles" /><span>Editor</span></label></li>
                           </ul>
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success">锁定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 设置角色 -->

      <!-- 绑定密钥  -->
      <div class="modal fade" id="mng-lock-key">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">绑定密钥</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="key-user">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="key-user" readonly />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="key-TF-KEY">TF-KEY</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="key-TF-KEY" readonly />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success">绑定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 绑定密钥 -->

      <!-- 解除谷歌otp绑定 -->
      <div class="modal fade" id="mng-unbind-otp">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">确认要解除谷歌otp锁定吗？</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" name="opt-user" readonly placeholder="请输入用户名" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success">解除</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 解除谷歌otp绑定 -->

      <!-- 重置登陆密码  -->
      <div class="modal fade" id="mng-reset-pwd">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">重置登陆密码</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="reset-user">用户名</label>
                        <div class="col-md-6">
                           <input type="text" class="form-control" id="reset-user" readonly/>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="reset-pwd">新密码<span>*</span></label>
                        <div class="col-md-6">
                           <input type="password" class="form-control" id="reset-pwd" placeholder="请输入密码" />
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label" for="reset-repwd">确认新密码<span>*</span></label>
                        <div class="col-md-6">
                           <input type="password" class="form-control" id="reset-repwd" placeholder="请再次输入密码" />
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success">保存</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 重置登陆密码 -->
   </div>
</template>
<script>
   import '../../../static/lib/jquery.gritter'
   import Custom from '../../assets/js/custom'
   export default {
      name: 'adminList',
      mounted(){
         var _self = this;
         $.gritter.add({
            title: 'This is a sticky notice!',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus lacus ut lectus rutrum placerat. ',
            image: '../../../static/img/user-2.jpg',
            sticky: true,
            time: '',
            class_name: 'my-sticky-class'
         });
         Custom.ajaxFn({
            _self: _self
         });
      },
      replace: true
   }
</script>
<style lang="less">
   .content{
      .manage-btns{padding-left: 0;
         >button{float: left; margin-right: 5px;
            &:last-child{margin-right: 0;}
         } 
      }
      .dataTable-filter{padding-right: 0;
         >label{
            >span,>input{float: left;}
            >span{display: block; line-height: 30px; padding-right: 10px;}
            >input{width: 83%;}
         }
      }
      #manage-table{
         >tbody{
            >tr{
               >td{
                  &:nth-child(4){text-align: right;}
               }
            }
         }
      }
      .form-horizontal{
         >.form-group{
            &:last-child{margin-bottom: 0;}
            >.control-label{
               >span{color: #f00; padding-left: 5px;}
               &.custom-label{padding-right: 0;}
            }
         }
      }
   }
</style>