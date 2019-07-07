<template>
  <div class="footer">
    <div class="footerContainer">
      <div class="footer-logo">
        <span class="iconfontMc">i enjoy it!</span>
      </div>
      <div class="footer-describe">
        <div class="copyRight">
          <p>©2019 Are you hangry? All Rights Reserved</p>
        </div>
        <div class="remark">
          <p>
            沪ICP备06017533号
            <span class="iconfont">&#xe643;</span>
            沪公网安备 3101040222246号
          </p>
          <p>预付卡信息对接唯一标识：3101023HU160100397</p>
        </div>
        <div class="other">
          <ul class="other-list">
            <li>隐私政策</li>
            <li>使用条款</li>
            <li>联系我们</li>
            <li>关注我们</li>
          </ul>
          <span class="iconfont wechat" @click="modal1 = true">&#xe600;</span>
          <span class="iconfont weibo">&#xe601;</span>
        </div>
        <div class="toTop" @click="toTop">
          <span class="iconfont">&#xe60f;</span>
          回到顶部
        </div>
      </div>
      <Modal :visible.sync="modal1" title="普通的Modal对话框标题" @on-ok="ok" @on-cancel="cancel">
        <p>对话框内容</p>
        <p>对话框内容</p>
        <p>对话框内容</p>
      </Modal>
    </div>
  </div>
</template>

<script>
let timer = null;
export default {
  data() {
    return {
      modal1: false
    };
  },
  methods: {
    ok() {
      this.$Message.info("点击了确定");
    },
    cancel() {
      this.$Message.info("点击了取消");
    },
    smoothscroll(e) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    toTop() {
      timer = setInterval(function() {
        let osTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        let ispeed = Math.floor(-osTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
          osTop + ispeed;
        this.isTop = true;
        if (osTop === 0) {
          clearInterval(timer);
        }
      }, 30);
    }
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

.iconfont {
  font-family: "iconfont" !important;
  font-size: 13px;
  font-style: normal;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

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

.footer {
  position: relative;
  bottom: 0;
  height: 300px;
  background: url(../.././assets/image/footer-bg.jpg);
}

.footerContainer {
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
  background-color: #ffbc0b;
  box-sizing: content-box;
  height: 120px;
  margin: 80px 0px;
  padding: 10px 0;
}

.footer-describe,
.footer-logo {
  margin: 0 50px;
  height: 70px;
}

.footer-describe {
  font-size: 13px;
  display: flex;
  /* line-height: 60px; */
  justify-content: space-between;
}

.footer-describe div {
  padding: 5px;
  box-sizing: content-box;
}

.other {
  position: relative;
}

.other-list li {
  /* font-size: 13px; */
  font-weight: 500;
  cursor: pointer;
  list-style: none;
  display: block;
  float: left;
  margin: 0 10px;
}

.other-list li:hover {
  color: #248ea9;
}

.wechat,
.weibo {
  display: block;
  float: right;
  font-size: 25px;
  margin: 0px 20px;
}

.wechat:hover,
.weibo:hover {
  color: #248ea9;
}

.toTop,
.toTop .iconfont {
  font-size: 20px;
  cursor: pointer;
}

.toTop:hover {
  color: #248ea9;
}
</style>