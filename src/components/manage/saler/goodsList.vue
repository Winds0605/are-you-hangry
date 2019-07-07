<template>
  <div class="goods-list">
    <div class="goods-show">
      <!-- <Table :columns="columns1" :data="TabelData" class="goods-table"></Table> -->
      <Table :columns="columns" :data="TabelData" class="goods-table">
        <template slot-scope="{ row, index }" slot="img">
          <div v-if="temp.editIndex === index">
            <img ref="newGoodsImg" class="new-goods-img" :src="row.img" />
            <Upload :action="url" style="margin-top:6px" :on-success="handleGoodsSuccess">
              <Button icon="ios-cloud-upload-outline">更新商品图片</Button>
            </Upload>
          </div>
          <img :src="row.img" v-else />
        </template>

        <template slot-scope="{ row, index }" slot="name">
          <Input type="text" v-model="temp.editName" v-if="temp.editIndex === index" />
          <span v-else>{{ row.name }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="price">
          <Input type="text" v-model="temp.editPrice" v-if="temp.editIndex === index" />
          <span v-else>{{ row.price }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="introduc">
          <Input type="text" v-model="temp.editIntroduc" v-if="temp.editIndex === index" />
          <span v-else>{{ row.introduc }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="action">
          <div v-if="temp.editIndex === index">
            <Button @click="handleSave(index)">保存</Button>
            <Button @click="temp.editIndex = -1">取消</Button>
          </div>
          <div v-else>
            <Button @click="handleEdit(row, index)">操作</Button>
            <Button @click="handleDelete(row)">删除</Button>
          </div>
        </template>
      </Table>
      <Page
        :total="paginations.total"
        size="small"
        show-elevator
        show-sizer
        :page-size="paginations.page_size"
        :page-size-opts="paginations.page_sizes"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        class="paginations"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      // 商品展示表头
      columns: [
        {
          title: "商品图片",
          slot: "img"
        },
        {
          title: "商品名",
          slot: "name"
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
      // 所有获取的商品数据
      allTableData: [],
      // 分页的商品数据
      TabelData: [],
      // 分页数据
      paginations: {
        page_index: 1, //当前位于哪页
        total: 0, //总数
        page_size: 5, //一页显示多少条
        page_sizes: [5, 10, 15, 20] //每页显示多少条
      },
      temp: {
        editIndex: -1,
        editName: "",
        editPrice: "",
        editIntroduc: "",
        editImg: ""
      }
    };
  },
  methods: {
    setPageData() {
      this.paginations.total = this.allTableData.length;
      let start =
        this.paginations.page_size * (this.paginations.page_index - 1);
      let end = Math.min(
        this.paginations.page_size * this.paginations.page_index - 1,
        this.allTableData.length - 1
      );
      this.TabelData = [];
      // console.log(start, end);
      for (let i = start; i <= end; i++) {
        this.TabelData.push(this.allTableData[i]);
      }
    },
    changePage(page) {
      this.paginations.page_index = page;
      this.setPageData();
    },
    changeSize(size) {
      this.paginations.page_size = size;
      this.setPageData();
    },
    // 上传图片到服务器成功的回调
    handleGoodsSuccess(res) {
      console.log(this.$refs.newGoodsImg.src);
      if (res.code === 1000) {
        this.temp.editImg = res.data.img;
        this.$refs.newGoodsImg.src = res.data.img;
        this.$refs.newGoodsImg.style.display = "block";
        this.$Message.success("上传图片成功");
      } else {
        this.$Message.error("上传图片出错");
      }
    },
    // 修改商品
    handleEdit(row, index) {
      this.temp.editName = row.name;
      this.temp.editPrice = row.price;
      this.temp.editImg = row.img;
      this.temp.editIntroduc = row.introduc;
      this.temp.editIndex = index;
    },
    // 保存商品
    async handleSave(index) {
      this.$refs.newGoodsImg.style.display = "none";
      this.allTableData[index].name = this.temp.editName;
      this.allTableData[index].img = this.temp.editImg;
      this.allTableData[index].price = this.temp.editPrice;
      this.allTableData[index].introduc = this.temp.editIntroduc;
      console.log(this.allTableData[index]);

      let body = this.$qs.stringify(this.allTableData[index]);
      await this.$axios.post("/goods/updateGoods", body).then(res => {
        console.log(res);
        if (res.data.code === 1000) {
          this.$Message.success("保存商品信息成功");
        } else {
          this.$Message.info("保存商品信息失败");
        }
      });
      this.temp.editIndex = -1;
      this.getGoodsList();
    },
    // 删除商品
    async handleDelete(row) {
      let params = {
        id: row.id
      };
      let body = this.$qs.stringify(params);
      await this.$axios.post("/goods/delGoods", body).then(res => {
        console.log(res);
        if (res.data.code === 1000) {
          this.$Message.success("删除商品信息成功");
        } else {
          this.$Message.info("删除商品信息失败");
        }
      });
      this.getGoodsList();
    },
    // 获取商家所有商品
    async getGoodsList() {
      let params = {
        shop_id: this.saler.shop_id
      };
      let body = this.$qs.stringify(params);
      await this.$axios.post("/goods/findAllGoodsByShop", body).then(res => {
        console.log(res);
        if (res.data.code === 1000) {
          this.allTableData = res.data.data.allGoodsByShop;
        }
      });
      this.setPageData();
    },
    ...mapMutations({
      setFlag: "SET_UPDATEFLAG"
    })
  },
  created() {
    this.getGoodsList();
    this.url = `${this.$baseUrl}/goods/upload`;
  },
  computed: {
    ...mapGetters(["saler", "updateFlag"])
  },
  watch: {
    updateFlag() {
      this.getGoodsList();
      this.setFlag(false);
    }
  }
};
</script>

<style scoped>
.goods-list {
  margin-left: 240px;
  padding-top: 80px;
  height: 100%;
  min-width: 850px;
}
.goods-show {
  margin: 20px;
}

.paginations {
  float: right;
  margin: 20px;
}
.goods-table img {
  width: 150px;
  height: 100px;
  margin: 5px 0;
}

/* .new-goods-img {
  display: none;
} */
</style>

