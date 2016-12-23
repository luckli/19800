<template>
   <div id="content" class="content">
      <h1 class="page-header">赛波分红 <small>赛波分红</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">赛波分红</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="buz-dividends">确认分红</button>
                  </div>
                  <div class="col-xs-4 col-md-4 search form-inline text-right">
                     <div class="form-group">
                        <label class="control-label custom-label">期间</label>
                     </div>
                     <div class="input-daterange input-group group-date" id="datepicker">
                        <input type="text" class="input-sm form-control date-range" placeholder="开始时间" v-model="search.beginDate" @change="getPageList()" readonly />
                        <span class="input-group-addon">to</span>
                        <input type="text" class="input-sm form-control date-range" placeholder="结束时间" v-model="search.endDate" @change="getPageList()" readonly />
                     </div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="dividends-table" class="table table-striped table-bordered table-box">
                     <thead>
                        <tr>
                           <th>用户名称</th>
                           <th>Email</th>
                           <th>发放日期</th>
                           <th>拥有数量</th>
                           <th>分红金额</th>
                           <th>是否已分红</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in items" :data-id="item.UserName">
                           <td>{{item.UserName}}</td>
                           <td>{{item.Email}}</td>
                           <td>{{item.AllottedAt}}</td>
                           <td>{{item.HeldVolume}}</td>
                           <td>{{item.PayAmount}}</td>
                           <td><span v-if="item.IsAllotted">已分红</span><span v-else>未分红</span></td>
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
      <!-- 分红 -->
      <div class="modal fade" id="mod-dividends">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 class="modal-title">分红</h4>
               </div>
               <div class="modal-body">
                  <form class="form-horizontal">
                     <div class="form-group">
                        <label class="col-md-4 control-label custom-label">期间</label>
                        <div class="col-md-6">
                           <select class="form-control input-sm" v-model="period">
                              <option v-for="r in range" :value="r">{{r}}</option>
                           </select>
                        </div>
                     </div>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                  <a href="javascript:;" class="btn btn-sm btn-success" @click="toAllot()">确定</a>
               </div>
            </div>
         </div>
      </div>
      <!-- 分红 -->
   </div>
</template>
<script>
   import Custom from 'custom'
   export default{
      name: 'dividends',
      data(){
         return{
            items: [],
            item: -1,
            period: '',
            range: [],
            search: {pageIndex: 1,pageSize: 10,beginDate: '',endDate: ''}
         }
      },
      mounted(){
         var vm = this;

         vm.getPageList();

         $('.manage-btns').on('click',function(e){
            e = e || window.event;

            var _id = $(e.target).attr('data-id');
            if('buz-dividends' == _id){
               if(0==vm.range.length){
                  vm.getPendingPeriodList();
               }
               $('#mod-dividends').modal('show');
            }
         });

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
      },
      methods:{
         // 确认分红
         toAllot: function(){
            var vm = this;
            Custom.ajaxFn('/Dividend/Allot',{
               data: {period: vm.period},
               callback: function(res){
                  if(res.IsSuccess){
                     vm.getPageList();
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                  }
                  $('#mod-dividends').modal('hide');
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '分红失败，'+res.statusText,index: -1});
               }
            });
         },
         getPageList: function(){
            var vm = this;

            Custom.ajaxFn('/Dividend/GetList',{
               data: vm.search,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data.Items;
                     for(var i = 0;i<list.length;i++){
                        list[i].AllottedAt = Custom.dateTimeFormatter(list[i].AllottedAt);
                     }
                     vm.items = list;
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 期间列表
         getPendingPeriodList: function(){
            var vm = this;

            Custom.ajaxFn('/Dividend/GetPendingPeriodList',{
               callback: function(res){
                  if(res.IsSuccess){
                     vm.range = res.Data;
                     vm.period = vm.range[0];
                  }else{
                     Custom.isSelected({title: '提示',txt: res.ErrorMsg,index: -1});
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
      }
   }
</script>