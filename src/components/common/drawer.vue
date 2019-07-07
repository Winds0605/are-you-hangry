<template>
  <div>
    <Drawer
      title="更改你的收货地址"
      v-model="showDrawer"
      width="920"
      :mask-closable="false"
      :closable="false"
      :styles="styles"
    >
      <!-- 地址信息展示表格 -->
      <Table :columns="tableHeader" :data="data" class="address-table">
        <template slot-scope="{ row, index }" slot="consignee">
          <Input type="text" v-model="editConsignee" v-if="editIndex === index" />
          <span v-else>{{ row.consignee }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="telephone">
          <Input type="text" v-model="editTelephone" v-if="editIndex === index" />
          <span v-else>{{ row.telephone }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="address">
          <Input type="text" v-model="editAddress" v-if="editIndex === index" />
          <span v-else>{{ row.address }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="tag">
          <Select
            v-model="editTag"
            style="width:100px"
            class="new-rec-info"
            placeholder="选择标签"
            v-if="editIndex === index"
          >
            <Option v-for="item in tag" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Tag v-else>{{ row.tag }}</Tag>
        </template>

        <template slot-scope="{ row, index }" slot="action">
          <div v-if="editIndex === index">
            <Button @click="handleSave(index,row)">保存</Button>
            <Button @click="editIndex = -1">取消</Button>
          </div>
          <div v-else>
            <Button @click="handleEdit(row, index)">操作</Button>
            <Button @click="handleRemove(row, index)">删除</Button>
          </div>
        </template>
      </Table>

      <!-- 新增地址对话框 -->
      <Button @click="showAddDialog=!showAddDialog" class="add-address">增加地址</Button>
      <Modal v-model="showAddDialog" title="增加收货地址" @on-ok="handleAdd" @on-cancel="cancel">
        <Input v-model="newRecInfo.consignee" placeholder="输入收货人" clearable class="new-rec-info" />
        <Input v-model="newRecInfo.telephone" placeholder="输入收货号码" clearable class="new-rec-info" />
        <Input v-model="newRecInfo.address" placeholder="输入收货地址" clearable class="new-rec-info" />
        <Select
          v-model="newRecInfo.tag"
          style="width:200px"
          class="new-rec-info"
          placeholder="请选择地址标签"
        >
          <Option v-for="item in tag" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Modal>

      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="hideEdit">好的</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      // 增加地址标记
      showAddDialog: false,
      // 新收货信息
      newRecInfo: {
        user_id: "",
        consignee: "",
        telephone: "",
        address: "",
        tag: ""
      },
      // tag选项
      tag: [
        {
          value: "家",
          label: "家"
        },
        {
          value: "公司",
          label: "公司"
        },
        {
          value: "学校",
          label: "学校"
        }
      ],
      // 抽屉样式
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      // 收货地址数据
      data: [],
      // 收货地址表格的表头
      tableHeader: [
        {
          title: "收货人",
          slot: "consignee"
        },
        {
          title: "电话号码",
          slot: "telephone"
        },
        {
          title: "地址",
          slot: "address"
        },
        {
          title: "标签",
          slot: "tag"
        },
        {
          title: "操作",
          slot: "action"
        }
      ],
      editIndex: -1, // 当前聚焦的输入框的行数
      editConsignee: "",
      editTelephone: "",
      editAddress: "",
      editTag: ""
    };
  },
  computed: {
    ...mapGetters(["showDrawer", "user"])
  },
  methods: {
    // 隐藏收货信息编辑
    hideEdit() {
      this.setDrawerShow(false);
    },
    // 编辑单条收货信息
    handleEdit(row, index) {
      console.log(row);
      this.editConsignee = row.consignee;
      this.editTelephone = row.telephone;
      this.editAddress = row.address;
      this.editTag = row.tag;
      this.editIndex = index;
    },
    // 保存单条收货信息
    async handleSave(index, row) {
      this.data[index].consignee = this.editConsignee;
      this.data[index].telephone = this.editTelephone;
      this.data[index].address = this.editAddress;
      this.data[index].tag = this.editTag;
      let body = this.$qs.stringify(this.data[index]);
      await this.$axios.post("/address/updateOneAddr", body).then(res => {
        if (res.data.code === 1000) {
          this.$Message.success("收货地址修改成功");
        } else {
          this.$Message.success("收货地址修改失败");
        }
      });
      this.editIndex = -1;
      this.getAddress();
    },
    // 删除单条收货信息
    // /address/delOneAddr
    async handleRemove(row, index) {
      let params = {
        addr_id: row.id
      };
      let body = this.$qs.stringify(params);
      console.log(body);
      await this.$axios.post("/address/delOneAddr", body).then(res => {
        if (res.data.code === 1000) {
          this.$Message.success("收货地址删除成功");
        } else {
          this.$Message.success("收货地址删除失败");
        }
      });
      this.getAddress();
    },
    // 提交新增收货信息
    async handleAdd() {
      let body = this.$qs.stringify(this.newRecInfo);
      await this.$axios.post("/address/addAddress", body).then(res => {
        if (res.data.code === 1000) {
          this.$Message.success("收货地址增加成功");
        } else {
          this.$Message.error("收货地址增加失败");
        }
      });
      this.getAddress();
      // 重置新增地址
      this.newRecInfo = {
        user_id: this.user.user_id,
        consignee: "",
        telephone: "",
        address: "",
        tag: ""
      };
    },
    // 取消新增收货信息
    cancel() {
      this.$Message.info("取消增加");
      this.newRecInfo = {
        consignee: "",
        telephone: "",
        address: "",
        tag: ""
      };
    },
    // 获取用户所有收货地址
    getAddress() {
      if (this.user.user_id) {
        let params = {
          user_id: this.user.user_id
        };
        let body = this.$qs.stringify(params);
        this.newRecInfo.user_id = this.user.user_id;
        this.$axios.post("/address/showAddress", body).then(res => {
          if (res.data.code === 1000) {
            this.data = res.data.data.data;
          } else {
            this.$Message.error("收货地址数据请求失败");
          }
        });
      }
    },
    ...mapMutations({
      setDrawerShow: "SET_SHOWDRAWER"
    })
  },
  created() {
    this.getAddress();
  }
};
</script>
<style>
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}

.add-address {
  margin-top: 10px;
}

.address-table {
  min-height: 230px;
}

.new-rec-info {
  margin: 15px 0;
}
</style>