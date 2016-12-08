<template>
   <div id="page-container" class="page-sidebar-fixed page-header-fixed">
      <div class="contain-progress"></div>
      <headers></headers>
      <side></side>
      <router-view></router-view>
   </div>
</template>

<script>
   import Headers from '../components/include/header'
   import Side from '../components/include/side'
   import '../assets/lib/default'
   import Pace from '../assets/lib/pace.min'

   export default {
      name: 'main',
      components: {
         Headers,
         Side
      },
      mounted(){
         Pace.start({document: true});
      },
      data () {
         return {
         }
      },
      methods: {

      },
      replace: true
   }
</script>