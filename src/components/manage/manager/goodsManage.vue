<template>
  <div class="goods-manage">
    <Table :columns="columns" :data="data" class="data">
      <template slot-scope="{ row, index }" slot="name">
        <span>{{ row.name }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="price">
        <span>{{ row.price }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="img">
        <img :src="row.img" alt />
      </template>

      <template slot-scope="{ row, index }" slot="introduc">
        <span>{{row.introduc}}</span>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <div>
          <Button @click="changeStatus(row)">通过</Button>
          <Button @click="refuse(row)">拒绝</Button>
        </div>
      </template>
    </Table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          title: "商品名",
          slot: "name"
        },
        {
          title: "图片",
          slot: "img"
        },
        {
          title: "价格",
          slot: "price"
        },
        {
          title: "简介",
          slot: "introduc"
        },
        {
          title: "操作",
          slot: "action"
        }
      ],
      data: []
    };
  },
  methods: {
    getAlldata() {
      this.$axios.get("goods/findGoods").then(res => {
        console.log(res);
        if (res.data.code === 1000) {
          this.data = res.data.data.data;
        } else {
          this.$Message.error("获取数据失败");
        }
      });
    },
    async changeStatus(row) {
      // console.log(row.id)
      let params = {
        goods_id: row.id
      };
      let body = this.$qs.stringify(params);
      await this.$axios.post("admin/approvalGood", body).then(res => {
        if (res.data.code === 1000) {
          this.$Message.success("审批通过成功");
        } else {
          this.$Message.success("审批失败");
        }
      });
      this.getAlldata();
    },
    async refuse(row) {
      let params = {
        goods_id: row.id
      };
      let body = this.$qs.stringify(params);
      await this.$axios.post("admin/approvalGoodRef", body).then(res => {
        if (res.data.code === 1000) {
          this.$Message.success("审批不通过成功");
        } else {
          this.$Message.success("审批失败");
        }
      });
      this.getAlldata();
    }
  },
  created() {
    this.getAlldata();
  }
};
</script>

<style scoped>
.goods-manage {
  padding: 100px 20px 20px 260px;
}

.goods-manage .data img {
  width: 150px;
  height: 100px;
  margin: 10px 0px;
}
</style>