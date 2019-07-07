<template>
  <div class="index">
    <Header />
    <router-view></router-view>
    <Drawer />
    <Chat />
    <Footer />
  </div>
</template>

<script>
import Header from "./common/header.vue";
import Footer from "./common/footer.vue";
import Drawer from "./common/drawer";
import Chat from "@/components/common/chat";

export default {
  components: {
    Header,
    Footer,
    Drawer,
    Chat
  }
};
</script>

<style scoped>
.index {
  height: 100%;
  position: relative;
}
</style>

<style>
.banner .ivu-carousel-list,
.banner .ivu-carousel-track,
.banner .ivu-carousel-item {
  height: 100% !important;
}
</style>
