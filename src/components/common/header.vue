<template>
  <div class="header flex">
    <div class="logo">
      <router-link :to="'/index'">
        <img src="@/assets/image/logo.png" title="回到首页" />
      </router-link>
    </div>

    <div class="nav-bar">
      <ul class="nav-list flex">
        <router-link :to="'/index'">
          <li>首页</li>
        </router-link>
        <router-link :to="'/register'">
          <li>商家入驻</li>
        </router-link>
        <router-link :to="'/index/meishi'">
          <li>美味时刻</li>
        </router-link>
        <router-link :to="'/index/order'">
          <li>我的订单</li>
        </router-link>
      </ul>
    </div>

    <div class="login-regis" v-show="!user.user_name">
      <Button type="success" @click="toLogin">
        <span class="iconfont icon">&#xe73c;</span>
        登录
      </Button>
      <Button type="warning" @click="toRegister">
        <span class="iconfont icon">&#xe648;</span>
        注册
      </Button>
    </div>
    <div class="login-regis" v-show="user.user_name">
      <Dropdown style="margin-left: 20px">
        <div class="demo-avatar">
          <Avatar type="ios-arrow-down" shape="square" icon="ios-person" size="large" />
          <Tag class="name">{{user.user_name}}</Tag>
        </div>
        <DropdownMenu slot="list">
          <DropdownItem @click.native="EditPersonInfo">编辑收货地址</DropdownItem>
          <DropdownItem @click.native="exit">退出</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      flag: true
    };
  },
  methods: {
    toLogin() {
      this.$router.push("/login");
    },
    toRegister() {
      this.$router.push("/register");
    },
    EditPersonInfo() {
      console.log("ok");
      this.setDrawerShow(true);
    },
    exit() {
      sessionStorage.removeItem("ayhToken");
      sessionStorage.removeItem("state");
      this.setUser({});
      this.setDrawerShow(false);
      this.$router.push("/login");
    },
    ...mapMutations({
      setDrawerShow: "SET_SHOWDRAWER",
      setUser: "SET_USER"
    })
  },
  computed: {
    ...mapGetters(["user"])
  }
};
</script>

<style scoped>
@font-face {
  font-family: "iconfont";
  src: url("../.././assets/font/iconfont.eot");
  src: url("../.././assets/font/iconfont.eot?#iefix")
      format("embedded-opentype"),
    url("../.././assets/font/iconfont.woff2") format("woff2"),
    url("../.././assets/font/iconfont.woff") format("woff"),
    url("../.././assets/font/iconfont.ttf") format("truetype"),
    url("../.././assets/font/iconfont.svg#iconfont") format("svg");
}

.login-regis .iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.flex {
  display: flex;
}

.header {
  padding: 0 60px;
  position: fixed;
  top: 0;
  background-color: white;
  z-index: 100;
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #d9d9d9;
}

.nav-bar {
  flex: 6;
  min-width: 450px;
}

.nav-list {
  justify-content: space-around;
  line-height: 80px;
}

.logo {
  position: relative;
  min-width: 90px;
  flex: 2;
  cursor: pointer;
}

.logo img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  width: 80px;
  height: 80px;
}

.login-regis {
  flex: 1;
}

.nav-list li {
  box-sizing: content-box;
  height: 79px;
  display: block;
  font-weight: 600;
  list-style: none;
  cursor: pointer;
  font-size: 14px;
  color: #515a6e;
}

.nav-list li:hover {
  color: #95adbe;
  border-bottom: 4px solid #95adbe;
}

.login-regis {
  display: flex;
  padding: 0 30px;
}

.login-regis button {
  position: relative;
  margin: 20px 20px;
  width: 80px;
  height: 40px;
}

.login-regis .arrow-down {
  position: relative;
  width: 30px;
  height: 30px;
  margin: 25px 20px;
}

.login-regis .demo-avatar {
  display: block;
  margin: 20px 0px;
}

.demo-avatar .name {
  position: absolute;
  left: 115%;
  top: 40%;
}
</style>