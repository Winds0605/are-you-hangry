<template>
  <div class="header-manage flex">
    <div class="logo">
      <img src="@/assets/image/logo.png" title="回到首页" />
    </div>
    <div class="sl iconfontMc">
      <p>Are you hangry?</p>
    </div>
    <div class="manager-avatar">
      <Dropdown style="margin-left: 20px">
        <Avatar shape="square" icon="ios-person" size="large" />
        <DropdownMenu slot="list">
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
    return {};
  },
  methods: {
    exit() {
      sessionStorage.removeItem("ayhToken");
      sessionStorage.removeItem("state");
      // 判断是商家登录还是用户登录
      if (this.saler.shop_id) {
        this.setSaler({});
      } else {
        this.setUser({});
      }
      this.setFlag(false);
      this.$router.push("/login");
    },
    ...mapMutations({
      setUser: "SET_USER",
      setSaler: "SET_SALER",
      setFlag: "SET_UPDATEFLAG"
    })
  },
  computed: {
    ...mapGetters(["user", "saler"])
  }
};
</script>

<style scoped>
@font-face {
  font-family: "KirangHaerang";
  font-style: normal;
  font-weight: 400;
  src: local("KirangHaerang"), local("KirangHaerang-Regular"),
    url("../../assets/font/KirangHaerang-Regular.ttf") format("truetype");
}

.iconfontMc {
  font-family: "KirangHaerang";
  font-size: 50px;
}

.flex {
  display: flex;
}

.header-manage {
  position: fixed;
  z-index: 10;
  width: 100%;
  background-color: white;
  height: 80px;
  border-bottom: 1px solid #d9d9d9;
}

.sl {
  text-align: center;
  line-height: 80px;
  flex: 7;
}
.manager-avatar {
  line-height: 80px;
  flex: 1;
}

.logo {
  position: relative;
  min-width: 90px;
  flex: 1;
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
</style>