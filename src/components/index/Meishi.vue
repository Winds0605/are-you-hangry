<template>
  <div class="meishi">
    <div class="all-shop">
      <Card :bordered="true" v-for="(item,index) in partShop" :key="index" class="shops">
        <p slot="title" @click="toDetail(item)">{{item.name}}</p>
        <img :src="item.img" @click="toDetail(item)" />
        <div class="shop-info">
          <p>
            <strong>
              类型：
              <Tag class="type">{{item.type}}</Tag>
            </strong>
          </p>
          <p class="detail">
            <strong>简介：</strong>
            {{item.detail}}
          </p>
          <p class="address">
            <strong>地址：</strong>
            {{item.address}}
          </p>
          <p class="phone">
            <strong>联系方式：</strong>
            {{item.phone}}
          </p>
        </div>
      </Card>
      <Page :total="page_total" show-elevator show-total class="shop-page" @on-change="changePage" />
    </div>
    <guess />
  </div>
</template>

<script>
import Guess from "@/components/common/guess";
export default {
  data() {
    return {
      all_shops: [],
      partShop: [],
      page_index: 1,
      page_size: 10,
      page_total: 0
    };
  },
  methods: {
    setPage() {
      this.page_total = this.all_shops.length;
      let start = this.page_size * (this.page_index - 1);
      let end = Math.min(this.page_size * this.page_index, this.page_total);
      for (let i = start; i < end; i++) {
        this.partShop.push(this.all_shops[i]);
      }
    },
    changePage(index) {
      this.partShop = [];
      this.page_index = index;
      this.setPage();
      window.scrollTo(0, 0);
    },
    // /shop/showShop
    // 获取所有商家
    async getAllShop() {
      await this.$axios.post("/shop/showShop").then(res => {
        console.log(res);
        if (res.data.code === 1000) {
          this.all_shops = res.data.data.all_shops;
        } else {
          this.$Message.error("获取商家数据失败");
        }
      });
      this.setPage();
    },
    // 到商家详情页
    toDetail(item) {
      this.$router.push({
        path: "/index/shopdetail",
        query: { shop_id: item.id }
      });
    }
  },
  created() {
    this.getAllShop();
  },
  components: {
    Guess
  }
};
</script>

<style scoped>
.meishi {
  display: flex;
  justify-content: space-between;
  padding: 80px 80px 0 80px;
  min-width: 1400px;
}

.all-shop {
  flex: 4;
  margin: 40px 0;
  overflow: hidden;
}

.all-shop .shops {
  margin: 20px 0;
}
.shop-page {
  text-align: center;
}

.shops .shop-info {
  float: right;
  width: 300px;
  margin-right: 100px;
}

.shops p {
  margin-left: 50px;
  cursor: pointer;
}

.shops img {
  margin: 10px 0 10px 50px;
  width: 250px;
  height: 150px;
  cursor: pointer;
}

.shop-info p {
  margin: 10px;
}
</style>