<template>
   <div id="content" class="content">
      <h1 class="page-header">角色权限分配 <small>备注</small></h1>
      <div class="row">
         <div class="col-md-12">
            <div class="panel panel-inverse">
               <div class="panel-heading"><h4 class="panel-title">角色权限分配</h4></div>
               <div class="panel-body">
                  <div class="col-xs-8 col-md-8 manage-btns">
                     <button class="btn btn-inverse" data-id="auth-save" @click="setRoleAuth()" :disabled="!isSave">保存</button>
                     <a href="#/main/modRole" class="btn btn-inverse">返回</a>
                  </div>
                  <div class="clearfix"></div>
                  <table id="roleAuth-table" class="table table-bordered table-box">
                     <thead>
                        <tr>
                           <th>模块</th>
                           <th>访问</th>
                           <th>权限</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="role in roleList" :class="role.ParentId == 0 ? 'success':''" :data-key="role.ModuleKey" :data-id="role.Id" :data-parent="role.ParentId" data-sign="1">
                           <td v-if="role.ParentId == 0"><i class="fa fa-chevron-down"></i>{{role.Name}}</td>
                           <td v-else><span class="txt-indent">{{role.Name}}</span></td>
                           <td>
                              <input type="checkbox" :name="role.Id" :id="role.Id" :data-id="0" :checked="role.isChecked" />
                           </td>
                           <td>
                              <ul class="role-list" v-if="role.ParentId != 0 && role.Limits.length != 0">
                                 <li v-for="limit in role.Limits">
                                    <label>
                                       <input type="checkbox" :name="role.Id" :id="limit.Code" :checked="limit.isChecked" /><span>{{limit.Name}}</span>
                                    </label>
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
               $list = $(e.target).closest('.role-list'),
               $i = $tr.find('td:first-child>i'),
               _pId = $tr.attr('data-parent'),
               _id = $tr.attr('data-id'),
               _cId = $tr.find('>td>input[type="checkbox"]').attr('name'),
               _sign = $tr.attr('data-sign'),k = '';

            if($tr.length != 0){
               if(0 == _pId && _id == _cId){
                  if(!$(e.target).attr('checked')){
                     $trs.each(function(){
                        if(_id == $(this).attr('data-parent')){
                           $(this).find('>td>input[type="checkbox"]').prop('checked',false);
                           $(this).find('.role-list input[type="checkbox"]:checked').prop('checked',false);
                        }
                     });
                  }
               }else if(0 != _pId && 0 == $list.length){
                  
                  if($(e.target).attr('checked')){
                     $trs.each(function(){
                        var id = $(this).attr('data-id');
                        if(id == _pId){
                           $(this).find('>td>input[type="checkbox"]').prop('checked',true);
                        }
                     })
                  }else{
                     var ids = [];
                     $trs.each(function(){
                        var pid = $(this).attr('data-parent'),
                           _input = $(this).find('>td>input[type="checkbox"]');
                        if(pid == _pId && !!_input.prop('checked')){
                           ids.push(_input.attr('name'));
                        }
                     });
                     $trs.each(function(){
                        var id = $(this).attr('data-id'),
                           $td = $(e.target),
                           $val = $(this).find('.role-list input[type="checkbox"]:checked');
                        if(id == _pId && 0 == ids.length){
                           $(this).find('>td>input[type="checkbox"]').prop('checked',false);
                        }
                        if($td.attr('id') == id){
                           //console.log(id , $val.attr('name'));
                           $val.prop('checked',false);
                        }else{
                        }
                     });
                  }
               }else if(0 != _pId && 0 != $list.length){
                  if($(e.target).attr('checked')){
                     $trs.each(function(){
                        var val = $(this).find('.role-list input[type="checkbox"]').attr('name');
                        if(val == _id){
                           $(this).find('>td>input[type="checkbox"]').prop('checked',true);
                        }
                     });
                     $trs.each(function(){
                        var val = $(this).find('.role-list input[type="checkbox"]').attr('name');
                        if(val == _id){
                           $(this).find('>td>input[type="checkbox"]').prop('checked',true);
                        }
                     });
                     var ids = -1;
                     $trs.each(function(){
                        var $val = $(this).find('.role-list input[type="checkbox"]'),
                           $val2 = $(this).find('>td>input[type="checkbox"]'),
                           id = $(this).attr('data-id'),
                           pid = $(this).attr('data-parent');

                        if(id == $val.attr('name') && !!$val2.prop('checked')){
                           ids = pid;
                        }
                     });
                     if(ids != -1){
                        $trs.each(function(){
                           var id = $(this).attr('data-id');
                           if(ids == id){
                              //console.log($(this).html());
                              $(this).find('>td>input[type="checkbox"]').prop('checked',true);
                           }
                        });
                     }
                  }
               }
               //vm.isSave = false;
            }
            if(0 == _pId && e.target == $i.get(0)){
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
         });
      },
      methods: {
         // 获取角色权限信息
         getRoleList: function(){
            var vm = this;

            Custom.ajaxFn('/Role/GetModuleAndLimitsList',{
               vm: vm,
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
                     vm.getRoleList2();
                  }
               },
               errorCallback: function(res){
                  vm.roleList = [];
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         getRoleList2: function(){
            var vm = this;

            Custom.ajaxFn('/Role/GetModuleLimits',{
               data: {roleId: vm.pId},
               vm: vm,
               callback: function(res){
                  if(res.IsSuccess){
                     var list = res.Data,rlist = vm.roleList,_tmp = [];
                     for(var i = 0;i< rlist.length;i++){
                        var k = rlist[i].ModuleKey,
                           clist = list[k];
                        if(clist && clist.length > 0){
                              vm.$set(rlist[i],'isChecked',true);
                              //rlist[i].isChecked = true;
                           for(var j = 0;j<rlist[i].Limits.length;j++){
                              if(0 < rlist[i].Limits.length){
                                 var code = rlist[i].Limits[j].Code;
                                 for(var c = 0;c<clist.length;c++){
                                    if(clist[c] == code){
                                       vm.$set(rlist[i].Limits[j],'isChecked',true);
                                       //rlist[i].Limits[j].isChecked = true;
                                       //_tmp.push();
                                    }
                                 }
                              }
                           }
                        }
                     }
                     console.log(rlist);
                     //$('#roleAuth-table>tbody>tr').click();
                  }
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 设置角色权限
         setRoleAuth: function(){
            var vm = this;

            var data = vm.getSaveData();
            console.log(JSON.stringify(data));
            Custom.ajaxFn('/Role/SetModuleLimit',{
               data: JSON.parse(JSON.stringify(data)),
               vm: vm,
               callback: function(res){
                  var msg = '';
                  if(res.IsSuccess){
                     //vm.roles = res.Data.Items;
                     vm.isSave = true;
                     vm.getRoleList2();
                     msg = '设置成功！';
                  }else{
                     msg = '设置失败,'+res.statusText;
                  }
                  Custom.isSelected({title: '提示',txt: msg,index: -1});
               },
               errorCallback: function(res){
                  Custom.isSelected({title: '提示',txt: '请求失败,'+res.statusText,index: -1});
               }
            });
         },
         // 获取保存数据
         getSaveData: function(){
            var vm = this,obj = {roleId: vm.pId,data: []},data = [],_data = [],_data2 = [];
            //{roleId:1,data:[{ModuleKey:'key',Limits:[1,2,3]}]}
            $('#roleAuth-table>tbody>tr').each(function(){
               var key = $(this).attr('data-key'),
                  pid = $(this).attr('data-parent'),
                  $val = $(this).find('td>input[type="checkbox"]:checked'),
                  $list = $(this).find('.role-list input[type="checkbox"]:checked'),tmp = [],tmp2 = [];
                  $val.each(function(){
                     tmp.push($(this).attr('data-id'));
                  });
                  _data.push({ModuleKey: key,Limits: tmp});
                  $list.each(function(){
                     var id = $(this).attr('name');
                        /*$val = $(this).closest('tbody'),
                        $parent = $(this).closest('tr>td>input[name="'+pid+'"]');*/
                        //tmp.push($val.find('tr>td>input[name="'+id+'"]').attr('id'));
                        //tmp.push($val.find('tr>td>input[name="'+pid+'"]').attr('id'));
                        tmp2.push($(this).attr('id'));
                  });

                  _data2.push({ModuleKey: key,Limits: tmp2});
            });
            for(var i = 0;i<_data.length;i++){

               for(var j = 0;j <_data2.length;j++){
                  if(_data[i].ModuleKey == _data2[j].ModuleKey && 0 == _data[i].Limits.length){
                     data.push(_data[i]);
                  }else if(_data[i].ModuleKey == _data2[j].ModuleKey && 0 != _data[i].Limits.length){
                     _data2[j].Limits.unshift(_data[i].Limits[0]);
                     data.push(_data2[j]);
                  }
               }
            }
            obj.data = data;
            return obj;
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