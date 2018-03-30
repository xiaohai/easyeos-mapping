<template>
  <div id="app">
    <Header></Header>
    <div class="main-cnt">
      <router-view></router-view>
    </div>
    <Source></Source>
    <Footer></Footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  @import 'assets/css/reset.css';
  @import 'assets/css/main.css';
</style>
