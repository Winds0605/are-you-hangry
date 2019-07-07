<template>
  <div class="guess">
    <h1 class="title">猜你喜欢</h1>
    <div class="shops">
      <Card :bordered="true" v-for="(item,index) in shops" :key="item.id" class="shops-item">
        <p slot="title">{{item.name}}</p>
        <Tag slot="title" class="tag">{{item.type}}</Tag>
        <img :src="item.img" @click="toDetail(item)" />
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shops: []
    };
  },
  methods: {
    // 获取商店
    getShop() {
      this.$axios.post("/shop/showShop").then(res => {
        console.log(res);
        // 选出五个商家
        let data = res.data.data.all_shops;
        let end = Math.min(data.length, 5);
        for (let i = 0; i < end; i++) {
          this.shops.push(data[i]);
        }
      });
    },
    toDetail(item) {
      this.$router.push({
        path: "/index/shopdetail",
        query: { shop_id: item.id }
      });
      history.go(0);
    }
  },
  created() {
    this.getShop();
  }
};
</script>

<style scoped>
.guess {
  flex: 1;
  margin: 40px 0 0 20px;
  min-width: 240px;
}
.title {
  background-color: #e8eaec;
  margin: 20px 0;
  border-radius: 10px;
  text-align: center;
  /* border-bottom: 1px solid #e8eaec; */
}
.guess .shops {
  margin: 20px 0;
}

.shops img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.guess .tag {
  position: absolute;
  right: 0;
  top: 5%;
}

.shops-item {
  margin: 15px 0;
}
</style>