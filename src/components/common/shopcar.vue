<template>
  <div class="shopcar-all">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="shopcar" ref="shopcar" v-show="showShopCarFlagOne">
        <span class="close iconfont" @click="showShopCarDelay">&#xe629;</span>
        <div class="shopcar-list">
          <Table height="320" border :columns="columns" :data="cartLists">
            <template slot-scope="{ row, index }" slot="name">
              <span>{{ row.goods_name }}</span>
            </template>

            <template slot-scope="{ row, index }" slot="quantity">
              <Icon type="md-remove" class="dec" @click="handleDec(row,index)" />
              <span>{{ row.quantity }}</span>
              <Icon type="md-add" class="add" @click="handleAdd(row,index)" />
            </template>

            <template slot-scope="{ row, index }" slot="price">
              <span>{{row.price*row.quantity}}</span>
            </template>

            <template slot-scope="{ row, index }" slot="action">
              <Button @click="handleRemove(row, index)">删除</Button>
            </template>
          </Table>
        </div>
        <div class="payPrice">
          <Button class="toPay" type="primary" @click="showDialogMethod">结算</Button>
          <span class="allPrice">总价格：￥{{allPrice}}</span>
          <Modal
            v-model="showDialog"
            title="选择收货地址"
            @on-ok="paymentCompleted"
            @on-cancel="paymentCancel"
            class="dialog"
          >
            <RadioGroup v-model="addr_id">
              <Radio
                v-for="(item,index) in addressData"
                :key="index"
                :label="item.id"
                class="address-radio"
              >
                <span>{{item.consignee}}</span>
                <span>{{item.address}}</span>
                <span>{{item.telephone}}</span>
              </Radio>
            </RadioGroup>
          </Modal>
        </div>
      </div>
    </transition>
    <span class="shop-logo-two iconfont" @click="showShopCar" v-show="showShopCarFlagTwo">&#xe614;</span>
  </div>
</template>

<script>
import animations from "create-keyframe-animation";
import { mapGetters } from "vuex";
export default {
  props: {
    updateShopcarFlag: {
      type: Boolean,
      default: false
    },
    goodsObj: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      showShopCarFlagOne: false,
      showShopCarFlagTwo: true,
      // 购物车数据表格表头
      columns: [
        {
          title: "商品名",
          slot: "name"
        },
        {
          title: "数量",
          slot: "quantity"
        },
        {
          title: "价格",
          slot: "price"
        },
        {
          title: "操作",
          slot: "action"
        }
      ],
      // 购物车数据
      cartLists: [],
      // 请求数据
      postData: {},
      // 收货地址数据
      addressData: [],
      // 收货地址数据表格表头
      columns1: [
        {
          title: "收货人",
          slot: "name"
        },
        {
          title: "联系方式",
          slot: "phone"
        },
        {
          title: "收货地址",
          slot: "address"
        },
        {
          title: "操作",
          slot: "action"
        }
      ],
      editIndex: -1,
      editIndexTwo: -1,
      editConsignee: "",
      editTelephone: "",
      editAddress: "",
      showDialog: false,
      addr_id: ""
    };
  },
  methods: {
    showShopCar() {
      this.showShopCarFlagTwo = !this.showShopCarFlagTwo;
      this.showShopCarFlagOne = !this.showShopCarFlagOne;
    },
    showShopCarDelay() {
      this.showShopCarFlagOne = !this.showShopCarFlagOne;
      setTimeout(() => {
        this.showShopCarFlagTwo = !this.showShopCarFlagTwo;
      }, 400);
    },

    // 动画钩子
    enter(el, done) {
      let animation = {
        0: {
          transform: "translate3d(100%,50%,0)"
        },
        100: {
          transform: "translate3d(0,50%,0)"
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.shopcar, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.shopcar.style.animation = "";
    },
    leave(el, done) {
      this.$refs.shopcar.style.transition = "all 0.4s";
      this.$refs.shopcar.style.transform = "translate3d(100%,50%,0)";
      this.$refs.shopcar.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.shopcar.style.transition = "";
      this.$refs.shopcar.style.transform = "";
    },
    // ~~~~~~~~~~~~~~~~~~~~

    // 移除购物车中商品
    async handleRemove(row, index) {
      this.cartLists.splice(index, 1);
      this.$Message.success("删除商品成功");
      let params = {
        id: row.id,
        user_id: this.user.user_id
      };
      let body = this.$qs.stringify(params);
      await this.$axios.post("/cart/delCartItem", body).then(res => {
        console.log(res);
        if (res.data.code !== 1000) {
          this.$Message.error("同步失败");
        }
      });
      this.getAllShopcar();
    },
    // 购物车中商品数量+1
    async handleAdd(row, index) {
      row.quantity++;
      this.postData = {
        goods_id: row.goods_id,
        id: row.id,
        quantity: 1,
        shop_id: row.shop_id,
        user_id: this.user.user_id
      };
      let body = this.$qs.stringify(this.postData);
      await this.$axios.post("/cart/addCartItem", body).then(res => {
        console.log(res);
      });
      this.getAllShopcar();
    },
    // 购物车中商品数量-1
    async handleDec(row, index) {
      if (row.quantity == 1) {
        this.handleRemove(row, index);
        return;
      }
      row.quantity--;
      this.postData = {
        goods_id: row.goods_id,
        id: row.id,
        quantity: -1,
        shop_id: row.shop_id,
        user_id: this.user.user_id
      };
      let body = this.$qs.stringify(this.postData);
      await this.$axios.post("/cart/addCartItem", body).then(res => {
        console.log(res);
      });
      this.getAllShopcar();
    },
    // 选择收货地址
    showDialogMethod() {
      if (this.cartLists.length === 0) {
        this.$Message.info("你还没添加你想要的商品哦");
        return;
      }
      this.showDialog = true;
      this.getAddress();
    },
    // 获取所有的收货地址
    getAddress() {
      let params = {
        user_id: this.user.user_id
      };
      let body = this.$qs.stringify(params);
      this.$axios.post("/address/showAddress", body).then(res => {
        if (res.data.code === 1000) {
          this.addressData = res.data.data.data;
        } else {
          this.$Message.error("收货地址数据请求失败");
        }
      });
    },
    paymentCompleted() {
      let params = {
        user_id: this.user.user_id,
        addr_id: this.addr_id,
        list_ids: this.list_ids,
        shop_id: this.$route.query.shop_id
      };
      let body = this.$qs.stringify(params);
      this.$axios.post("/order/createOrder", body).then(res => {
        console.log(res);
        if (res.data.code === 1000) {
          this.$Message.info("下单成功");
          this.showShopCarFlagOne = !this.showShopCarFlagOne;
          this.$router.push("/index/order");
        } else {
          this.$Message.info("下单失败");
        }
      });
    },
    paymentCancel() {
      this.$Message.info("取消支付");
    },
    handleEdit(row, index) {
      this.editName = row.name;
      this.editPhone = row.phone;
      this.editAddress = row.address;
      this.editIndexTwo = index;
    },
    handleSave(index) {
      this.data1[index].name = this.editName;
      this.data1[index].phone = this.editPhone;
      this.data1[index].address = this.editAddress;
      this.editIndexTwo = -1;
    },
    // 获取所有购物车数据
    getAllShopcar() {
      let params = {
        user_id: this.user.user_id
      };
      let body = this.$qs.stringify(params);
      this.$axios.post("/cart/findCartItem", body).then(res => {
        console.log(res);
        if (res.data.code === 1000) {
          let data = res.data.data.cartLists;
          this.cartLists = data.filter(item => {
            let shop_id = this.$route.query.shop_id;
            return item.shop_id === shop_id;
          });
        } else {
          this.$Message.error("获取购物车数据失败");
        }
      });
    }
  },
  computed: {
    allPrice() {
      let price = 0;
      if (this.cartLists) {
        for (let i = 0; i < this.cartLists.length; i++) {
          price += this.cartLists[i].price * this.cartLists[i].quantity;
        }
      }
      return price;
    },
    list_ids() {
      let arr = [];
      for (let i = 0; i < this.cartLists.length; i++) {
        arr.push(this.cartLists[i].id);
      }
      return arr.toString();
    },
    ...mapGetters(["user"])
  },
  watch: {
    updateShopcarFlag() {
      setTimeout(() => {
        this.getAllShopcar();
      }, 300);
      this.$emit("changeFlag", false);
      console.log(this.updateShopcarFlag);
    },
    async goodsObj() {
      // 页面先渲染数据再请求数据同步
      let fake = {
        goods_name: this.goodsObj[0].fake_name,
        price: this.goodsObj[0].fake_price,
        quantity: this.goodsObj[0].quantity
      };
      // 标记购物车是否已有此商品标记
      let flag = false;
      // 有则数量+1
      for (let i = 0; i < this.cartLists.length; i++) {
        if (fake.goods_name === this.cartLists[i].goods_name) {
          this.cartLists[i].quantity++;
          flag = true;
          break;
        }
      }
      // 无则push
      if (flag == false) {
        this.cartLists.push(fake);
      }

      this.$Message.success("加入购物车成功");
      if (this.goodsObj.length > 0) {
        for (let i = 0; i < this.cartLists.length; i++) {
          if (this.goodsObj[0].goods_id === this.cartLists[i].goods_id) {
            this.goodsObj[0].id = this.cartLists[i].id;
          }
        }
        let body = this.$qs.stringify(this.goodsObj[0]);
        await this.$axios.post("/cart/addCartItem", body).then(res => {
          if (res.data.code !== 1000) {
            this.$Message.error("同步失败");
          }
        });
        this.getAllShopcar();
      }
    }
  },
  created() {
    this.getAllShopcar();
  }
};
</script>

<style scoped>
.shopcar {
  /* border-radius: 10px; */
  border-bottom-left-radius: 10px;
  position: fixed;
  right: 0;
  top: 0;
  transform: translate3d(0, 50%, 0);
  height: 400px;
  width: 600px;
  background-color: #c5b7b7;
  z-index: 10;
}

.shopcar-list {
  height: 80%;
  background-color: #c5b7b7;
}

.payPrice {
  height: 20%;
  border-top: 1px solid #afaca6;
  background-color: #c5b7b7;
  border-bottom-left-radius: 10px;
}

.close {
  float: right;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
  line-height: 30px;
  font-size: 30px;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #c5b7b7;
  cursor: pointer;
  z-index: 100;
}

.shop-logo-two {
  float: right;
  display: block;
  position: fixed;
  top: 50%;
  line-height: 50px;
  right: 0;
  transform: translate(0, 50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #c5b7b7e5;
  cursor: pointer;
  z-index: 100;
}

.shop-logo:hover {
  background-color: #aa9f9fe5;
}

.add,
.dec {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: #afaca6;
  border-radius: 50%;
  line-height: 20px;
  margin: 0 10px;
  cursor: pointer;
}

.add:hover,
.dec:hover {
  background-color: #cac6be;
}

.allPrice {
  float: right;
  font-size: 20px;
  line-height: 80px;
  margin: 0 20px;
}

.toPay {
  float: right;
  height: 40px;
  margin: 20px 20px;
  font-weight: 500;
}

.save,
.cancle {
  margin: 5px 0;
}

.address-radio {
  display: block;
  margin: 10px;
}
</style>

