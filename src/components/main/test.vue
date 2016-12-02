<template>
   <h3 @click="cFn()">{{msg}}</h3>
</template>
<script>
   export default{
      name: 'test',
      data(){
         return {
            msg: 'sky'
         }
      },
      methods: {
         cFn: function(){
            var vm = this;
            vm.$emit('css-fn',vm.msg);
         }
      }
   }
</script>