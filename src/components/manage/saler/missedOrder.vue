<template>
  <div class="rec-order">
    <Table :columns="columns" :data="orderData">
      <template slot-scope="{ row, index }" slot="order_id">
        <span>{{ row.order_id }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="consignee">
        <span>{{ row.consignee }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="telephone">
        <span>{{ row.telephone }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="address">
        <span>{{ row.address }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <div>
          <Button @click="getOrderDetail(row)">查看</Button>
          <Button @click="updateOrder(row)">接单</Button>
          <Button @click="refuseOrder(row)">拒单</Button>
        </div>
      </template>
    </Table>

    <Modal v-model="modalFlag" title="订单购买项" :footer-hide="true">
      <div v-for="item in orderDetailData" :key="item.id">
        <span>{{item.goods_name}}</span>
        <span>&emsp;&emsp;{{item.quantity}}份</span>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // 订单数据表头
      columns: [
        {
          title: "订单编号",
          slot: "order_id"
        },
        {
          title: "联系人",
          slot: "consignee"
        },
        {
          title: "联系号码",
          slot: "telephone"
        },
        {
          title: "地址",
          slot: "address"
        },
        {
          title: "操作",
          slot: "action"
        }
      ],
      // 订单数据
      orderData: [],
      modalFlag: false,
      // 订单详情数据
      orderDetailData: []
    };
  },
  methods: {
    // 获取用户订单
    async getOrder() {
      this.orderData = [];
      let params = {
        shop_id: this.saler.shop_id
      };
      let body = this.$qs.stringify(params);

      await this.$axios.post("/shop/getOrder", body).then(res => {
        console.log(res);
        let data = res.data.data.ordersList;
        for (let i = 0; i < data.length; i++) {
          if (data[i].status === 0) {
            this.orderData.push(data[i]);
          }
        }
      });
    },
    // 查看订单详情
    getOrderDetail(row) {
      this.modalFlag = true;
      let params = {
        order_id: row.order_id
      };
      let body = this.$qs.stringify(params);
      this.$axios.post("/order/getOrderInfo", body).then(res => {
        console.log(res);
        this.orderDetailData = res.data.data.order_info;
      });
    },
    // 商家接单
    async updateOrder(row) {
      let params = {
        order_id: row.order_id,
        status: 1
      };
      let body = this.$qs.stringify(params);
      await this.$axios.post("/order/updateOrder", body).then(res => {
        console.log(res);
      });
      this.getOrder();
    },
    // 商家拒绝接单
    async refuseOrder(row) {
      let params = {
        order_id: row.order_id,
        status: -1
      };
      let body = this.$qs.stringify(params);
      await this.$axios.post("/order/updateOrder", body).then(res => {
        console.log(res);
      });
      this.getOrder();
    }
  },
  created() {
    this.getOrder();
  },
  computed: {
    ...mapGetters(["saler"])
  }
};
</script>

<style scoped>
.rec-order {
  padding: 100px 20px 20px 260px;
  min-width: 1100px;
}
</style>
