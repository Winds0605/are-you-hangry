<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "App",
  mounted() {
    window.addEventListener("unload", this.saveState);
  },
  methods: {
    saveState() {
      sessionStorage.setItem("state", JSON.stringify(this.$store.state));
    }
  }
};
</script>

<style>
#app {
  height: 100%;
}

body,
html {
  height: 100%;
}

@font-face {
  font-family: "iconfont";
  src: url("./assets/font/iconfont.eot");
  src: url("./assets/font/iconfont.eot?#iefix") format("embedded-opentype"),
    url("./assets/font/iconfont.woff2") format("woff2"),
    url("./assets/font/iconfont.woff") format("woff"),
    url("./assets/font/iconfont.ttf") format("truetype"),
    url("./assets/font/iconfont.svg#iconfont") format("svg");
}

.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  font-size: 40px;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@font-face {
  font-family: "Monoton";
  font-style: normal;
  font-weight: 400;
  src: local("Monoton"), local("Monoton-Regular"),
    url("./assets/font/Monoton-Regular.ttf") format("truetype");
}

.register .ivu-form-item{
  margin-bottom: 14px;
} 

/* 组件aside */
.form .ivu-form-item-content {
  height: 32px;
}

.form .ivu-form-item-error-tip {
  left: 26%;
}

.price .ivu-form-item-error-tip {
  left: 10% !important;
}
.name .ivu-form-item-error-tip,
.price .ivu-form-item-error-tip {
  top: 75% !important;
}

.introduc .ivu-form-item-error-tip {
  top: 90% !important;
}

.aside .ivu-col-span-8 {
  width: auto !important;
  height: 100%;
}
.ivu-menu {
  height: 100%;
}
.ivu-form-inline .ivu-form-item {
  margin-right: 0 !important;
}

.model .ivu-modal {
  min-width: 520px;
}

.shopcar-list .ivu-table-cell {
  text-align: center;
  /* font-size: 13px; */
}
</style>
