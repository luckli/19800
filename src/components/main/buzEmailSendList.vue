<template>
   <div id="content" class="content">
      <h1 class="page-header">邮件发送列表 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">邮件发送列表</h4></div>
               <div class="panel-body">
                  <div class="form-inline text-right">
                     <div class="form-group">
                        <label>国家</label>
                        <select class="form-control input-sm" v-model="search.country" @change="getPageList()">
                           <option v-for="c in countryList" :value="c.id">{{c.val}}</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <label>语言</label>
                        <select class="form-control input-sm" v-model="search.langType" @change="getPageList()">
                              <option v-for="type in types" :value="type.id">{{type.val}}</option>
                           </select>
                     </div>
                     <div class="form-group">
                        <input type="text" class="input-sm form-control" placeholder="请输入用户编号" v-model="search.key" @change="getPageList()" />
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="vip-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>分类</th>
                           <th>国家编号</th>
                           <th>语言编号</th>
                           <th>用户编号</th>
                           <th>邮件发送地址</th>
                           <th>邮件内容</th>
                           <th>创建时间</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items">
                           <td>{{item.Key}}</td>
                           <td>{{item.Country}}</td>
                           <td>{{item.LangType}}</td>
                           <td>{{item.UserId}}</td>
                           <td>{{item.Mobile}}</td>
                           <td>{{item.Body}}</td>
                           <td>{{item.CreateTime}}</td>
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
   </div>
</template>
<script>
   import Custom from 'custom'
   export default {
      name: 'shortMsg',
      data(){
         return{
            items: [],
            countryList: [{id: -1,val: '请选择'},{id: 0,val: '中国'}],
            types: [{id: -1,val: '请选择'},{id: 0,val: 'CN'},{id: 1,val: 'EN'}],
            search: {country: 0,langType: 0,key: '',page: 1,pageSize: 10}
         }
      },
      mounted(){
         var vm = this;

         vm.getPageList();
      },
      methods: {
         getPageList: function(){
            var vm = this;

            Custom.ajaxFn('/Notice/GetEmailPageList',{
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data;
                     for(var i = 0;i<list.length;i++){
                        list[i].CreateTime = Custom.dateTimeFormatter(list[i].CreateTime);
                     }
                     vm.items = list;
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         }
      },
      replace: true
   }
</script>