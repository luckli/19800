<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import './assets/lib/bootstrap/css/bootstrap.min'
  import './assets/lib/font-awesome/css/font-awesome.min'
  import './assets/lib/style.min'
  import './assets/lib/animate.min'
  import './assets/css/reset'
  
  //import Login from './components/login'
  /*import Hello from './components/Hello'*/

  export default {
    name: 'app',
    mounted() {
      var vm = this;
      vm.init();
    },
    methods: {
      init: function(){
        var vm = this;
      }
    }/*,
    components: {
      Login
    }*/,
    replace:true
  }
</script>