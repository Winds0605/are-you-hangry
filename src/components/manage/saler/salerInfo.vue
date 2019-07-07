<template>
  <div class="salerInfo">
    <Card :bordered="true" class="saler-info">
      <p slot="title">饮烟时代</p>
      <div class="saler-img">
        <img :src="shop_info.img" alt />
        <Upload :action="url" v-show="EditFlag" :on-success="handleUpload">
          <Button icon="ios-cloud-upload-outline">更改商家图片</Button>
        </Upload>
      </div>
      <div class="saler-info-list">
        <div class="edit" v-show="EditFlag">
          <Form :model="shop_info" label-position="left" :label-width="100">
            <FormItem label="商家名:">
              <Input v-model="shop_info.name"></Input>
            </FormItem>
            <FormItem label="商家类型:">
              <Select v-model="shop_info.type" style="width:200px">
                <Option
                  v-for="item in typeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="手机号:">
              <Input v-model="shop_info.phone" disabled></Input>
            </FormItem>
            <FormItem label="简介:">
              <Input v-model="shop_info.detail"></Input>
            </FormItem>
            <FormItem label="商家地址:">
              <Input v-model="shop_info.address"></Input>
            </FormItem>
          </Form>
          <div class="btn">
            <Button type="success" @click="saveEdit">保存</Button>
            <Button type="warning" @click="cancelEdit">取消</Button>
          </div>
        </div>
        <div class="showInfo" v-show="!EditFlag">
          <p>
            <Tag color="default" class="tag">商家名:</Tag>
            {{shop_info.name}}
          </p>
          <p>
            <Tag color="default" class="tag">商家类型:</Tag>
            {{shop_info.type}}
          </p>
          <p>
            <Tag color="default" class="tag">手机号:</Tag>
            {{shop_info.phone}}
          </p>
          <p>
            <Tag color="default" class="tag">简介:</Tag>
            {{shop_info.detail}}
          </p>
          <p>
            <Tag color="default" class="tag">商家地址:</Tag>
            {{shop_info.address}}
          </p>
          <Button type="info" @click.native="changeEditFlag">编辑</Button>
        </div>
      </div>
    </Card>
    <Card :bordered="true" class="goods-info">
      <Card :bordered="true" class="goods-item" v-for="(item,index) in hot_shop" :key="index">
        <img :src="item.img" />
      </Card>
    </Card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // 图片上传到服务器接口地址
      url: "",
      shop_info: {},
      hot_shop: [],
      typeList: [
        {
          value: "其他",
          label: "其他"
        },
        {
          value: "中餐厅",
          label: "中餐厅"
        },
        {
          value: "西餐厅",
          label: "西餐厅"
        },
        {
          value: "火锅",
          label: "火锅"
        },
        {
          value: "自助",
          label: "自助"
        }
      ],
      EditFlag: false
    };
  },
  methods: {
    changeEditFlag() {
      this.EditFlag = true;
      console.log("ok");
    },
    async saveEdit() {
      let body = this.$qs.stringify(this.shop_info);
      await this.$axios.post("/shop/updateShop", body).then(res => {
        console.log(res);
      });
      this.EditFlag = false;
      // setTimeout(() => {
      this.getShopInfo();
      // }, 500);
    },
    cancelEdit() {
      this.EditFlag = false;
    },
    handleUpload(res, file) {
      this.shop_info.img = res.data.img;
    },
    // 获取商家信息
    getShopInfo() {
      let params = {
        shop_id: this.saler.shop_id
      };
      let body = this.$qs.stringify(params);
      this.$axios.post("/shop/findShop", body).then(res => {
        console.log(res);
        this.shop_info = res.data.data.shop;
      });
    },
    async getGoodsList() {
      let params = {
        shop_id: this.saler.shop_id
      };
      let body = this.$qs.stringify(params);
      await this.$axios.post("/goods/findAllGoodsByShop", body).then(res => {
        let data = res.data.data.allGoodsByShop;
        let end = Math.min(data.length, 3);
        for (let i = 0; i < end; i++) {
          this.hot_shop.push(data[i]);
        }
      });
    }
  },
  mounted() {
    this.url = `${this.$baseUrl}/goods/upload`;
  },
  created() {
    this.getShopInfo();
    this.getGoodsList();
  },
  computed: {
    ...mapGetters(["saler"])
  }
};
</script>

<style scoped>
.salerInfo {
  display: flex;
  flex-direction: column;
  margin-left: 240px;
  padding-top: 80px;
  min-width: 850px;
}

.saler-img {
  float: left;
  margin-left: 100px;
}

.saler-img img {
  width: 350px;
  height: 200px;
}

.goods-info .goods-item img {
  width: 270;
  height: 180px;
}

.saler-info-list {
  width: 450px;
  float: left;
  margin-left: 100px;
}

.saler-info-list .input {
  margin: 10px 0;
}

.saler-info-list .btn {
  float: right;
}

.saler-info,
.goods-info {
  margin: 20px;
  min-width: 640px;
}

.showInfo p {
  margin: 15px 0;
}

.goods-info {
  height: 300px;
  justify-content: space-around;
}

.goods-item {
  flex: 1;
  height: 250px;
  margin: 0 10px;
}
</style>

<style>
.goods-info .ivu-card-body {
  display: flex;
  overflow: hidden;
  padding: 24px;
}

.saler-info .ivu-card-body {
  overflow: hidden;
}
</style>
