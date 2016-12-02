<template>
   <div id="content" class="content">
      <h1 class="page-header">资金账户列表 <small>资金账户列维护</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">资金账户列表</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="ca-add">添加资金账户</button>
                     <button class="btn btn-inverse" data-id="ca-lock">锁定</button>
                     <button class="btn btn-inverse" data-id="ca-unlock">解锁</button>
                     <button class="btn btn-inverse" data-id="ca-setDefault">设为默认充值账户</button>
                  </div>
                  <div class="clearfix"></div>
                  <table id="ca-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>开户人</th>
                           <th>账户类型</th>
                           <th>账号</th>
                           <th>账户银行</th>
                           <th>余额</th>
                           <th>是否锁定</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td>栾爱新</td>
                           <td>支付宝</td>
                           <td>15000648745</td>
                           <td>中国建设银行</td>
                           <td>183,982.0000</td>
                           <td>已锁定</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<script>
   export default {
      name: 'ca',
      data(){
         return {

         }
      },
      mounted(){

      },
      methods:{

      },
      replace: true
   }
</script>