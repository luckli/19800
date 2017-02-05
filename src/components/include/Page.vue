<template>
   <ul class="pagination">
      <div v-html="lists"></div>
      <!-- <div v-html="page.html"></div> -->
      <li v-if="item != 1"><a href="javascript:;" @click="goTo(item)">首页</a></li>
      <li v-if="item != 1"><a href="javascript:;" @click="prevFn()">&laquo;</a></li>
      <li v-for="list in page.list"><a href="javascript:;" @click="goTo(list)" :class="{'active': item == list}" :readonly="item == list">{{list}}</a></li>
      <li v-if="item != total"><a href="javascript:;" @click="nextFn()">&raquo;</a></li>
      <li v-if="item != total"><a href="javascript:;" @click="goTo(total)">尾页</a></li>
   </ul>
</template>
<script>
   import Custom from 'custom'
   export default{
      name:'page',
      data(){
         return {
            item: this.index
         }
      },
      mounted(){
         var vm = this;

      },
      computed: {
         page: function(){
            var vm = this,html = '',arr = [];
            if(vm.total <= 4){
              for(var i = 1;i<=vm.total;i++){
                  if(vm.item == i){
                     html += '<a href="javascript:;" class="active">'+i+'</a>';
                  }else{
                     html += '<a href="javascript:;" data-page="'+i+'">'+i+'</a>';
                  }
                  arr.push(i);
              }
            }else{
              for(var i = 1;i<=4;i++){
                  if(vm.item == 1 || vm.item == 2){
                     if(vm.item == i){
                        html += '<a href="javascript:;" class="active">'+i+'</a>';
                     }else{
                        html += '<a href="javascript:;" data-page="'+i+'">'+i+'</a>';
                     }
                     arr.push(i);
                  }else if((vm.total - vm.item) == 0 || (vm.total - vm.item) == 1){
                     if((vm.total - vm.item) == 0 && i == 4){
                        html += '<a href="javascript:;" class="active">'+(vm.total-4+i)+'</a>';
                     }else if((vm.total - vm.item) == 1 && i == 4){
                        html += '<a href="javascript:;" class="active">'+(vm.total-4+i)+'</a>';
                     }else{
                        html += '<a href="javascript:;" data-page="'+(vm.total-4+i)+'">'+(vm.total-4+i)+'</a>';
                     }
                     arr.push(vm.total-4+i);
                  }else{
                     if(i == 3){
                        html += '<a href="javascript:;" class="active">'+(vm.item-3+i)+'</a>';
                     }else{
                        html += '<a href="javascript:;" data-page="'+(vm.item-3+i)+'">'+(vm.item-3+i)+'</a>';
                     }
                     arr.push(vm.item-3+i);
                  }
              }
            }
            return {
               html: html,
               list: arr
            };
         }
      },
      props:{
         index: {
            type: Number,
            default: 1
         },
         size: {
            type: Number,
            default: 10
         },
         total: {
            type: Number,
            default: 0
         }
      },
      methods:{
         prevFn: function(){
            var vm = this;
            vm.item --;
            if(0==vm.item){
               vm.item = 1;
            }
         },
         goTo: function(index){
            var vm = this;
            if(vm.item == index){
               console.log('stop');
               return;
            }
            vm.item = index;
         },
         nextFn: function(){
            var vm = this;
            vm.item ++;
            if(vm.total == vm.item){
               vm.item = vm.total;
            }
         }
      },
      replace: true
   }
</script>