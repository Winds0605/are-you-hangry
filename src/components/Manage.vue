<template>
  <div class="manage">
    <Header class="header"/>
    <Aside class="aside"/>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from "./common/headerManage";
import Aside from "./common/aside";
export default {
  components: {
    Header,
    Aside
  }
};
</script>

<style scoped>
.manage{
  height:100%;
}
</style>