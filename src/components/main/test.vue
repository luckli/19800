<template>
   <div style="margin-left: 300px;">
      <button @click="toMsg()">父件到组件</button>
      <Txt :msg="msg" :that="that"></Txt>
      <Txt2 :that="that"></Txt2>
   </div>
</template>
<script>
   import vuex from 'vuex'
   import Custom from 'custom'
   import Txt from '../include/test2'
   import Txt2 from '../include/test3'
   export default{
      name: 'test',
      data(){
         return {
            msg: 'vuex',
            that: this
         }
      },
      methods:{
         toMsg: function(){
            var vm = this;
            vm.that.$emit('cssFn','父件');
         }
      },
      components: {
         Txt,
         Txt2
      }
   }
</script>