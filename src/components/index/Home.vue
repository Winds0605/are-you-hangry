<template>
  <div class="home">
    <div class="banner">
      <Carousel class="carousel" autoplay>
        <Carousel-item>
          <div class="demo-carousel carousel1"></div>
        </Carousel-item>
        <Carousel-item>
          <div class="demo-carousel carousel2"></div>
        </Carousel-item>
        <Carousel-item>
          <div class="demo-carousel carousel3"></div>
        </Carousel-item>
        <Carousel-item>
          <div class="demo-carousel carousel4"></div>
        </Carousel-item>
        <Carousel-item>
          <div class="demo-carousel carousel5"></div>
        </Carousel-item>
        <Carousel-item>
          <div class="demo-carousel carousel6"></div>
        </Carousel-item>
      </Carousel>
    </div>
    <div class="show-hot">
      <div class="title">
        <h1 class="hot-text">热 门 商 家</h1>
        <router-link :to="'/index/meishi'">
          <span class="more">
            查看更多
            <Icon type="ios-arrow-dropright" />
          </span>
        </router-link>
      </div>

      <div class="hot-goods">
        <div class="col" v-for="(item,index) in goodList" :key="index">
          <div class="table">
            <h2>{{item.name}}</h2>
            <img :src="item.img" />
            <div class="detail">{{item.detail}}</div>
            <Tag class="type-tag">
              <strong>{{item.type}}</strong>
            </Tag>
            <button class="to-shopcar" @click="toDetail(item)">查看商家</button>
          </div>
        </div>
      </div>
    </div>
    <div class="show-hot-saler"></div>
    <div class="test"></div>
    <div class="test"></div>
    <div class="test"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodList: []
    };
  },
  methods: {
    getHotShop() {
      this.$axios
        .post("/shop/hotShop")
        .then(res => {
          console.log("hot");
          console.log(res);
          if (res.data.code === 1000) {
            this.goodList = res.data.data.hotShops;
          } else {
            this.$Message.error("热门商家获取失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toDetail(item) {
      this.$router.push({
        path: "/index/shopdetail",
        query: { shop_id: item.id }
      });
      window.scrollTo(0, 0);
    }
  },
  created() {
    this.getHotShop();
  }
};
</script>

<style scoped>
.home {
  width: 100%;
  padding: 80px 80px 0;
}
/* 轮播图 */
.banner {
  width: 100%;
  height: 600px;
}
.carousel,
.demo-carousel {
  width: 100%;
  height: 100%;
}

.carousel div {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.carousel1 {
  background: url(../.././assets/image/banner1.jpg);
}
.carousel2 {
  background: url(../.././assets/image/banner2.jpg);
}
.carousel3 {
  background: url(../.././assets/image/banner3.jpg);
}
.carousel4 {
  background: url(../.././assets/image/banner4.jpg);
}
.carousel5 {
  background: url(../.././assets/image/banner5.jpg);
}
.carousel6 {
  background: url(../.././assets/image/banner6.jpg);
}

/* 热门商品 */
.show-hot {
  display: block;
  height: 100px;
  margin-top: 80px;
  text-align: center;
  border-bottom: 2px solid #d9d9d9;
}

.title {
  position: relative;
}

.more {
  position: absolute;
  right: 0;
  bottom: 5px;
}

.hot-text {
  font-size: 40px;
  line-height: 100px;
}

.hot-goods {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  text-align: center;
  flex-wrap: wrap;
}

.col {
  flex: 25%;
  padding: 10px;
  max-width: 320px;
  min-width: 200px;
}

.table {
  background-color: white;
  padding: 20px 20px;
  font-family: "montserrat", sans-serif;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0px 0px 5px #00000070;
}

.detail {
  font-size: 20px;
  margin: 10px 0;
}

.type-tag {
  margin: 10px 0;
}

.table .to-shopcar {
  width: 80%;
  color: #2c3e50;
  display: block;
  padding: 10px 0;
  margin: 10px auto;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: 0.2s linear;
  outline: none;
  cursor: pointer;
}

.table .dis-shopcar {
  width: 80%;
  color: #2c3e50;
  display: block;
  padding: 10px 0;
  margin: 10px auto;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: line-through;
}

.table .to-shopcar:hover {
  background: #2c3e50;
  color: #fff;
}

.table img {
  height: 100px;
  width: 150px;
  border-radius: 5px;
  margin-top: 5px;
}

.test {
  height: 400px;
}
</style>