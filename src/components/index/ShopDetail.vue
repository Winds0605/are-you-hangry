<template>
  <div class="shop-detail">
    <div class="shop-inner">
      <Card :bordered="true" class="shop-infos">
        <p slot="title">{{shopInfo.name}}</p>
        <img :src="shopInfo.img" alt />
        <div class="shop-info">
          <p>
            <strong>
              类型：
              <Tag>{{shopInfo.type}}</Tag>
            </strong>
          </p>
          <p>
            <strong>简介：</strong>
            {{shopInfo.detail}}
          </p>
          <p>
            <strong>地址：</strong>
            {{shopInfo.address}}
          </p>
          <p>
            <strong>联系方式：</strong>
            {{shopInfo.phone}}
          </p>
        </div>
      </Card>
      <div class="foods">
        <div class="foods-item" v-for="(item,index) in allGoodsByShop" :key="index">
          <img :src="item.img" />
          <p class="name">{{item.name}}</p>
          <p class="introduc">{{item.introduc}}</p>
          <p class="price">￥{{item.price}}</p>
          <Icon type="md-add" class="icon" @click="handleAdd(item)" />
        </div>
      </div>
    </div>
    <!-- this.$emit("changeFlag", false); -->
    <shopcar
      :updateShopcarFlag="updateShopcarFlag"
      @changeFlag="changeFlag"
      :goodsObj="goodsInCar"
    />
    <guess />
  </div>
</template>

<script>
import Shopcar from "@/components/common/shopcar";
import Guess from "@/components/common/guess";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      shopInfo: {},
      allGoodsByShop: [],
      goodsInCar: [],
      updateShopcarFlag: false
    };
  },
  methods: {
    // 将商品加入购物车
    handleAdd(item) {
      let params = {
        fake_name: item.name,
        fake_price: item.price,
        goods_id: item.id,
        user_id: this.user.user_id,
        quantity: 1,
        shop_id: this.$route.query.shop_id,
        id: ""
      };
      this.goodsInCar = [];
      this.goodsInCar.push(params);

      // let body = this.$qs.stringify(params);
      // console.log(body);
      // this.$axios.post("cart/addCartItem", body).then(res => {
      //   if (res.data.code === 1000) {
      //     this.$Message.success("加入购物车成功");
      //   } else {
      //     this.$Message.success("加入购物车失败");
      //   }
      // });
      // this.updateShopcarFlag = true;
    },
    // 获取商家信息
    getShopInfo() {
      let params = {
        shop_id: this.$route.query.shop_id
      };
      let body = this.$qs.stringify(params);
      this.$axios.post("/shop/findShop", body).then(res => {
        if (res.data.code === 1000) {
          this.shopInfo = res.data.data.shop;
        } else {
          this.$Messagr.error("获取商铺信息失败");
        }
      });
    },
    // 获取商品信息
    getGoodsList() {
      let params = {
        shop_id: this.$route.query.shop_id
      };
      let body = this.$qs.stringify(params);
      this.$axios.post("/goods/findAllGoodsByShop", body).then(res => {
        if (res.data.code === 1000) {
          console.log(res);
          this.allGoodsByShop = res.data.data.allGoodsByShop;
        }
      });
    },
    changeFlag(e) {
      this.updateShopcarFlag = e;
    }
  },
  components: {
    Shopcar,
    Guess
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.getShopInfo();
    this.getGoodsList();
  }
};
</script>

<style scoped>
.shop-detail {
  display: flex;
  padding: 80px 80px 0 80px;
}

.shop-detail .shop-inner {
  flex: 4;
  margin: 60px 0;
}

.shop-detail img {
  margin: 10px 0;
  width: 250px;
  height: 150px;
}

.shop-detail .shop-info {
  float: right;
  margin-right: 100px;
  line-height: 40px;
}

.shop-detail .foods {
  min-width: 1000px;
  display: flex;
  flex-wrap: wrap;
  padding: 13px;
  justify-content: start;
  min-height: 400px;
  margin: 20px 0;
  border: 1px solid #e8eaec;
  border-radius: 10px;
  overflow: hidden;
}

.foods-item {
  height: 220px;
  width: 200px;
  margin: 21px;
  border: 1px solid #e8eaec;
  border-radius: 5px;
}

.foods-item img {
  display: block;
  margin: 10px auto;
  width: 80%;
  height: 100px;
  border-radius: 2px;
}

.foods-item .name {
  font-size: 20px;
  display: block;
  text-align: left;
  margin-top: 20px;
  margin-left: 20px;
}

.foods-item:hover {
  box-shadow: 1px 1px 5px 1px black;
}

.foods-item .price {
  display: inline-block;
  margin-top: 10px;
  margin-left: 20px;
  color: #ff5a5a;
  font-size: 13px;
}

.foods-item .introduc {
  display: block;
  margin-left: 20px;
  font-size: 10px;
  color:#c2c3c5;
}

.foods-item .icon {
  float: right;
  margin: 5px 5px 0 0;
  font-size: 25px;
  background-color: #ffd161;
  border-radius: 50%;
  cursor: pointer;
}
</style>