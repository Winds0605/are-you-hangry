<template>
  <div class="order">
    <Table :columns="columns" :data="order" no-data-text="暂无订单" class="shwoOrder">
      <template slot-scope="{ row, index }" slot="id">
        <span>{{ row.id }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="counts">
        <span>{{ row.counts }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="create_time">
        <span>{{ crtTimeFtt(row.create_time) }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="shop_name">
        <span>{{ row.shop_name }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="status">
        <!-- a == 10 ? 10 :(a ==20 ?  20 :'未知') -->
        <span>{{ row.status===0?'商家未接单':(row.status===1?'商家已接单':'商家拒接单') }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <div>
          <Button @click="showModal(row)">查看订单详情</Button>
        </div>
      </template>
    </Table>
    <Modal v-model="modal1" title="订单详情" :footer-hide="true">
      <p v-for="item in order_list" :key="item.id">
        <span>{{item.goods_name}}&emsp;</span>
        <span>{{item.quantity}}份&emsp;</span>
        <span>￥{{item.price}}</span>
      </p>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      order: [],
      order_list: [],
      list1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      columns: [
        {
          title: "订单编号",
          slot: "id"
        },
        {
          title: "总价格",
          slot: "counts"
        },
        {
          title: "下单时间",
          slot: "create_time"
        },
        {
          title: "订单状态",
          slot: "status"
        },
        {
          title: "购买商家",
          slot: "shop_name"
        },
        {
          title: "操作",
          slot: "action"
        }
      ],
      modal1: false
    };
  },
  methods: {
    // 获取所有订单
    getAllOrder() {
      let params = {
        user_id: this.user.user_id
      };
      let body = this.$qs.stringify(params);
      console.log(body);
      this.$axios.post("/order/showOrder", body).then(res => {
        console.log(res);
        if (res.data.code === 1000) {
          this.order = res.data.data.orders;
        } else {
          this.$Message.error("获取订单失败");
        }
      });
    },
    // 获取订单详细信息
    showModal(row) {
      let params = {
        order_id: row.id
      };
      let body = this.$qs.stringify(params);

      this.$axios.post("/order/getOrderInfo", body).then(res => {
        console.log(res);
        this.order_list = res.data.data.order_info;
      });
      this.modal1 = true;
    },
    // 格式化时间戳
    crtTimeFtt(val) {
      if (val != null) {
        var date = new Date(val);
        var years = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours =
          date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes =
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return (
          years +
          "-" +
          month +
          "-" +
          day +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          seconds
        );
      }
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.getAllOrder();
  }
};
</script>

<style scoped>
.order {
  margin: 100px 60px 0 60px;
  min-width: 1000px;
}

.scroll {
  height: 900px;
}

.shwoOrder {
  min-height: 400px;
}
</style>