<template>
   <div>
      <h2> {{title}} - {{msg}}</h2><button v-on:click="onSendMsg();">组件到父件</button>
      <div>
         <table>
            <thead><th>ID</th><th>内容</th></thead>
            <tbody>
               <tr v-for="item in $store.getters.prodItems"><td>{{item.prod_id}}</td><td>{{item.prod_name}}</td></tr>
            </tbody>
         </table>
      </div>
   </div>
</template>
<script>
   export default {
      props: {
         msg: {
            type: String,
            default: ''
         },
         that: {
            type: Object,
            default: null
         }
      },
      data: function() {
         return {
            title: '组件1'
         }
      },
      methods: {
         onSendMsg: function(){
            var vm = this;
            var prodItems = [
               {prod_id: '1', prod_name: '1111'},
               {prod_id: '2', prod_name: '2222'},
               {prod_id: '3', prod_name: '3333'}
            ];
            vm.$store.dispatch('setProdItems', {prod: prodItems});
         }
      },
      mounted: function() {
         var vm = this;
         vm.that.$on('cssFn',function(res){
            vm.title = res;
            return res;
         });
      }
   }
</script>