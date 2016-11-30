<template>
   <div id="content" class="content">
      <h1 class="page-header">角色权限分配 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">角色权限分配</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="auth-save" v-if="isSave" disabled>保存</button>
                     <button class="btn btn-inverse" data-id="auth-save" v-else @click="setRoleAuth()">保存</button>
                  </div>
                  <div class="clearfix"></div>
                  <table id="roleAuth-table" class="table table-bordered">
                     <thead>
                        <tr>
                           <th>模块</th>
                           <th>访问</th>
                           <th>权限</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="role in roleList" :class="role.ParentId == 0 ? 'success':''" :data-id="role.Id" :data-parent="role.ParentId" data-sign="1">
                           <td v-if="role.ParentId == 0"><i class="fa fa-chevron-down"></i>{{role.Name}}</td>
                           <td v-else><span class="txt-indent">{{role.Name}}</span></td>
                           <td><input type="checkbox" :id="role.Id" /></td>
                           <td>
                              <ul class="role-list" v-if="role.ParentId != 0 && role.Limits.length != 0">
                                 <li v-for="limit in role.Limits">
                                    <label><input type="checkbox" :name="role.Id" :id="limit.Code"><span>{{limit.Name}}</span></label>
                                 </li>
                              </ul>
                           </td>
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
   import Custom from '../../assets/js/custom'
   export default {
      name: 'roleAuth',
      data(){
         return{
            pId: -1,
            roleList: [],
            isSave: true,
            index: -1,
            authObj: {roleId: '',moduleKey: '',limits: []}
         }
      },
      mounted(){
         var vm = this;

         vm.pId = vm.$route.params.Id;

         vm.getRoleList();
         $('#roleAuth-table').on('click',function(e){
            e = e || window.event;

            var $tr = $(e.target).closest('tbody>tr'),
               $trs = $(e.target).closest('tbody').find('tr'),
               $i = $tr.find('td:first-child>i'),
               _pId = $tr.attr('data-parent'),
               _id = $tr.attr('data-id'),
               _sign = $tr.attr('data-sign'),k = '';
            if($tr.length != 0){
               if(0 == _pId){
                  if(1 == _sign){
                     $i.removeClass('fa-chevron-down').addClass('fa-chevron-up');
                     $trs.each(function(){
                        k = $(this).attr('data-parent');
                        if(_id == k){
                           $(this).addClass('hide');
                        }
                     });
                     $tr.attr('data-sign',0);
                  }else{
                     $i.removeClass('fa-chevron-up').addClass('fa-chevron-down');
                     $trs.each(function(){
                        k = $(this).attr('data-parent');
                        if(_id == k){
                           $(this).removeClass('hide');
                        }
                     });
                     $tr.attr('data-sign',1);
                  }
               }
               if(vm.index == _id){
                  vm.index = -1;
                  //$trs.removeClass('warning');
               }else{
                  vm.index = _id;
                  //$tr.addClass('warning').siblings('tr').removeClass('warning');
               }
            }
         });
      },
      methods: {
         // 获取角色权限信息
         getRoleList: function(){
            var vm = this;

            Custom.ajaxFn('/Role/GetModuleAndLimitsList',{
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data,_tmp = {},_tmp2 = {},finalList = [];
                     for(var i = 0;i<list.length;i++){
                        if(0 == list[i].ParentId){
                           if(_tmp['0']){
                              _tmp['0'].push(list[i]);
                           }else{
                              _tmp['0'] = [];
                              _tmp['0'].push(list[i]);
                           }
                        }
                        for(var j= 0;j<list.length;j++){
                           if(list[i].Id == list[j].ParentId){
                              if(_tmp2[list[i].Id]){
                                 _tmp2[list[i].Id].push(list[j]);
                              }else{
                                 _tmp2[list[i].Id] = [];
                                 _tmp2[list[i].Id].push(list[j]);
                              }
                           }
                        }
                     }
                     _tmp[0].sort(function(a,b){ return a.SortIndex - b.SortIndex; });
                     for(var m in _tmp[0]){
                        var a = _tmp[0];
                        finalList.push(a[m]);
                        
                        for(var n in _tmp2){
                           _tmp2[n].sort(function(a,b){ return a.SortIndex -b.SortIndex; });
                           for(var l = 0;l<_tmp2[n].length;l++){
                              var k = _tmp2[n];
                              if(a[m].Id == k[l].ParentId){
                                 finalList.push(k[l]);
                              }
                           }
                        }
                     }
                     vm.roleList = finalList;
                     Custom.ajaxFn('/Role/GetModuleLimits',{
                        data: {roleId: vm.pId},
                        callback: function(res){
                           if(res.IsSuccess){
                              //vm.roleList = res.Data || [];

                              /*var list = [{roleId: '1',moduleId: 1,ModuleKey: '1',SortIndex: 1,parentId: 0,Name: '模块管理',Limits: []},{roleId: '1',moduleId: 3,ModuleKey: '1',SortIndex: 0,parentId: 0,Name: '模块管理2',Limits: []},{roleId: '1',moduleId: 2,ModuleKey: '2',SortIndex: 3,parentId: 1,Name: '子模块管理',Limits: [{id: 1,val: 'zzzz'},{id: 2,val: 'ssss'},{id: 3,val: 'gggg'}]},{roleId: '1',moduleId: 4,ModuleKey: '2',SortIndex: 7,parentId: 1,Name: '子模块管理2',Limits: [{id: 1,val: 'zzzz'},{id: 2,val: 'ssss'},{id: 3,val: 'gggg'}]}],_tmp = {},_tmp2 = {},finalList = [];
                              for(var i = 0;i<list.length;i++){
                                 if(0 == list[i].ParentId){
                                    if(_tmp['0']){
                                       _tmp['0'].push(list[i]);
                                    }else{
                                       _tmp['0'] = [];
                                       _tmp['0'].push(list[i]);
                                    }
                                 }
                                 for(var j= 0;j<list.length;j++){
                                    if(list[i].Id == list[j].ParentId){
                                       if(_tmp2[list[i].Id]){
                                          _tmp2[list[i].Id].push(list[j]);
                                       }else{
                                          _tmp2[list[i].Id] = [];
                                          _tmp2[list[i].Id].push(list[j]);
                                       }
                                    }
                                 }
                              }

                              for(var m in _tmp[0]){
                                 _tmp[0].sort(function(a,b){ return a.SortIndex -b.SortIndex; });
                                 var a = _tmp[0];
                                 finalList.push(a[m]);
                                 
                                 for(var n in _tmp2){
                                    _tmp2[n].sort(function(a,b){ return a.SortIndex -b.SortIndex; });
                                    for(var l = 0;l<_tmp2[n].length;l++){
                                       var k = _tmp2[n];
                                       if(a[m].Id == k[l].ParentId){
                                          finalList.push(k[l]);
                                       }
                                    }
                                 }
                              }*/
                           }
                        },
                        errorCallback: function(res){
                           console.log(res);
                        }
                     });
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });
         },
         // 设置角色权限
         setRoleAuth: function(){
            var vm = this;

            /*Custom.ajaxFn('/Role/SetModuleLimit',{
               data: vm.authObj,
               callback: function(res){
                  if(res.IsSuccess){
                     vm.roles = res.Data.Items;
                  }
               },
               errorCallback: function(res){
                  console.log(res);
               }
            });*/
         }
      },
      replace: true
   }
</script>
<style lang="less">
   #roleAuth-table{
      >tbody{
         >tr{cursor: pointer;
            >td{height: 40px; line-height: 20px;
               &:first-child{width: calc(100%-58px-80%);
                  >i{margin-right: 5px;}
               }
               &:nth-child(2){ width: 58px; text-align: center;
               }
               &:last-child{width: 80%}
               input[type="checkbox"]{margin-top: 0; height: 13px; line-height: 13px;}
            }
         }
      }
   }
   .role-list{
      >li{float: left; margin-right: 15px;
         >label{margin-bottom: 0;
            >*{vertical-align: middle;}
            >span{padding-left: 5px;}
         }
      }
   }
</style>