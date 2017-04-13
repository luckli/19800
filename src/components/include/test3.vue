<template>
   <div>
      <button @click="sendMsg()">组件到组件</button>
   </div>
</template>
<script>
   export default {
      props: {
         that: {
            type: Object,
            default: null
         }
      },
      methods: {
         sendMsg: function(){
            var vm = this;
            vm.that.$emit('cssFn','组件');
         },
        
      }
   }
</script>