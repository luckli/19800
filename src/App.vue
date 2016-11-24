<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import '../static/lib/bootstrap/css/bootstrap.min'
  import '../static/lib/font-awesome/css/font-awesome.min'
  import '../static/lib/style.min'
  import '../static/lib/animate.min'
  import './assets/css/reset'
  
  //import Login from './components/login'
  /*import Hello from './components/Hello'*/

  export default {
    name: 'app',
    mounted() {
      var _self = this;
      _self.init();
    },
    methods: {
      init: function(){
        var _self = this;
      }
    }/*,
    components: {
      Login
    }*/,
    replace:true
  }
</script>