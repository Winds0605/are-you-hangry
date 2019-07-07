<template>
  <div class="aside">
    <Col span="8">
      <Menu active-name="1" accordion ref="Menu" v-if="this.saler.shop_id">
        <router-link :to="'/manage/saler/salerinfo'">
          <MenuItem name="1" class="menu-item">
            <Icon type="md-chatbubbles" />个人信息
          </MenuItem>
        </router-link>
        <Submenu name="2">
          <template slot="title">
            <Icon type="ios-paper" />商家管理
          </template>

          <router-link :to="'/manage/saler/goodslist'">
            <MenuItem name="1-1" class="menu-item">商品管理</MenuItem>
          </router-link>

          <MenuItem name="1-2" class="menu-item" @click.native="showModal=true">添加商品</MenuItem>

          <!-- saleorder -->
          <Submenu name="3">
            <template slot="title">订单管理</template>
            <router-link :to="'/manage/saler/missedorder'">
              <MenuItem name="3-1" class="menu-item">未处理订单</MenuItem>
            </router-link>
            <router-link :to="'/manage/saler/recorders'">
              <MenuItem name="3-2" class="menu-item">已处理订单</MenuItem>
            </router-link>
          </Submenu>
        </Submenu>
        <Modal v-model="showModal" title="添加新商品" @on-ok="ok" @on-cancel="cancel" class="model">
          <Form ref="formInline" :model="newGoods" :rules="ruleInline" inline>
            <Upload :action="url" :on-success="handleSuccess" type="drag" accept="image/*">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或拖拽上传商品图片</p>
              </div>
            </Upload>
            <img
              src="@/assets/image/uploadImg.gif"
              style="display:none"
              ref="showUploadImg"
              class="showUploadImg"
            />
            <FormItem prop="name" class="name">
              <Input v-model="newGoods.name" placeholder="输入商品名" clearable class="new-goods-name" />
            </FormItem>
            <FormItem prop="price" class="price">
              <Input
                v-model="newGoods.price"
                placeholder="输入商品价格"
                clearable
                class="new-goods-price"
              />
            </FormItem>
            <FormItem prop="introduc" class="introduc">
              <Input
                v-model="newGoods.introduc"
                placeholder="输入商品简介"
                clearable
                class="new-goods-introduc"
              />
            </FormItem>
          </Form>
        </Modal>
      </Menu>
      <Menu v-if="this.user.user_id === 'admin'">
        <Submenu name="1">
          <template slot="title">
            <Icon type="ios-paper" />内容管理
          </template>
          <MenuItem name="1-1">商品管理</MenuItem>
        </Submenu>
      </Menu>
    </Col>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      showRes: "",
      showModal: false,
      newGoods: {
        name: "",
        price: "",
        img: "",
        introduc: ""
      },
      ruleInline: {
        name: [
          {
            required: true,
            message: "请输入商品名",
            trigger: "blur"
          }
        ],
        price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur"
          }
        ],
        introduc: [
          {
            required: true,
            message: "请输入商品简介",
            trigger: "blur"
          }
        ]
      },
      url: ""
    };
  },
  methods: {
    // 通过另一个按钮触发文件类型的输入框的点击事件
    showUpload() {
      this.$refs.inputFile.click();
    },
    handleSuccess(res, file) {
      this.newGoods.img = res.data.img;
      this.$refs.showUploadImg.src = res.data.img;
      this.$refs.showUploadImg.style.display = "block";
    },
    ok() {
      // 判断新增商品是否填写
      this.$refs.formInline.validate(valid => {
        if (valid) {
          // 判断图片是否为空
          if (this.newGoods.img !== "") {
            let body = this.$qs.stringify(this.newGoods);
            this.$axios.post("/goods/addGoods", body).then(res => {
              console.log(res);
              if (res.data.code === 1000) {
                this.$Message.success("已提交商品信息审核");
                this.setFlag(true);
                this.newGoods.name = "";
                this.newGoods.price = "";
                this.newGoods.img = "";
              } else {
                this.$Message.error("提交商品信息审核失败");
              }
            });
          } else {
            this.$Message.error("图片未添加");
          }
        } else {
          this.$Message.error("添加商品信息失败");
        }
      });
      console.log(this.newGoods);
    },
    cancel() {
      this.$Message.info("取消添加商品信息");
      this.newGoods.name = "";
      this.newGoods.price = "";
      this.newGoods.img = "";
    },
    ...mapMutations({
      setFlag: "SET_UPDATEFLAG"
    })
  },
  computed: {
    ...mapGetters(["saler", "user"])
  },
  mounted() {
    this.url = `${this.$baseUrl}/goods/upload`;
    this.newGoods.shop_id = this.saler.shop_id;
  }
};
</script>

<style scoped>
.inputFile {
  display: none;
}
.aside {
  height: 100%;
  position: fixed;
  overflow: hidden;
  margin-top: 80px;
}

.menu-item {
  color: #515a6e;
}

.input-goods-name,
.input-goods-price {
  display: block;
  width: 200px;
}

.showUploadImg {
  height: 280px;
  width: 100%;
}

.new-goods-name,
.new-goods-price {
  margin: 15px 0;
  width: 230px;
}
.new-goods-introduc {
  width: 488px;
}

.new-goods-price {
  margin-left: 24px;
}
</style>

