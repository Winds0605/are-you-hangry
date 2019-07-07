<template>
  <div class="register">
    <Card :bordered="false" class="card">
      <router-link :to="'index'">
        <span class="mono">Are you hungry?</span>
      </router-link>
      <Form ref="registerInfo" :model="registerInfo" :rules="ruleInline" class="form">
        <FormItem prop="identity" class="identity formItem">
          <label>注册类型:</label>
          <Select class="input-identity input" v-model="registerInfo.identity" style="width:200px">
            <Option
              v-for="item in identityOptions"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>

        <FormItem
          prop="username"
          class="user formItem"
          v-if="this.registerInfo.identity === 'user'"
        >
          <label>用户名:</label>
          <Input
            class="input-name input"
            v-model="registerInfo.username"
            placeholder="输入你的用户名..."
            style="width: 200px;"
          />
        </FormItem>

        <FormItem
          prop="username"
          class="user formItem"
          v-if="this.registerInfo.identity === 'sale'"
        >
          <label>店铺名:</label>
          <Input
            class="input-name input"
            v-model="registerInfo.username"
            placeholder="输入你的店铺名..."
            style="width: 200px;"
          />
        </FormItem>

        <FormItem prop="password" class="password formItem">
          <label>密码:</label>
          <Input
            type="password"
            class="input-password input"
            v-model="registerInfo.password"
            placeholder="输入你的密码..."
            style="width: 200px"
          />
        </FormItem>

        <FormItem prop="confirmPw" class="password formItem">
          <label>确认密码:</label>
          <Input
            type="password"
            class="input-password input"
            v-model="registerInfo.confirmPw"
            placeholder="请确认输入的密码..."
            style="width: 200px"
          />
        </FormItem>

        <FormItem prop="phone" class="formItem">
          <label>手机号:</label>
          <Input
            class="input-name input"
            v-model="registerInfo.phone"
            placeholder="此手机号作为登录账号..."
            style="width: 200px;"
          />
        </FormItem>

        <FormItem prop="verify_code" class="formItem">
          <label>验证码:</label>
          <Button
            type="primary"
            :disabled="!disabled"
            class="getCode"
            @click="getCodeMethods"
          >{{getCode}}</Button>
          <Input
            class="input-code input"
            v-model="registerInfo.verify_code"
            placeholder="填写验证码..."
            style="width: 100px;"
          />
        </FormItem>

        <FormItem prop="address" class="formItem" v-if="this.registerInfo.identity === 'sale'">
          <label>商家地址:</label>
          <Input
            class="input-name input"
            v-model="registerInfo.address"
            placeholder="Enter you address..."
            style="width: 200px;"
          />
        </FormItem>
      </Form>
      <p class="to-register">
        已有账号？前往
        <a @click="toRegister">登录</a>
      </p>
      <div class="login-btn">
        <Button class="btn" type="info" @click="handleSubmit('registerInfo')">Register</Button>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  data() {
    // 密码校验
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerInfo.confirmPw !== "") {
          // 对第二个密码框单独验证
          this.$refs.registerInfo.validateField("confirmPw");
        }
        callback();
      }
    };
    // 确认密码密码校验
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else if (value !== this.registerInfo.password) {
        callback(new Error("两次输入的密码不一样"));
      } else {
        callback();
      }
    };
    return {
      getCode: "获取验证码",
      disabled: true,
      registerInfo: {
        identity: "",
        username: "",
        password: "",
        confirmPw: "",
        phone: "",
        type: "其他",
        verify_code: "",
        verify_token: "",
        address: "",
        img:
          "https://s0.meituan.net/bs/file/?f=meis/meishi.web:assets/c56d3179722effd4.png@03d195d",
        detail: "这个商家很懒,还没有介绍"
      },
      identityOptions: [
        {
          value: "sale",
          label: "商家"
        },
        {
          value: "user",
          label: "用户"
        }
      ],
      // { validator: validatePass, trigger: 'blur' }
      // { validator: validatePassCheck, trigger: 'blur' }
      ruleInline: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            validator: validatePass,
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码不能少于六位",
            trigger: "blur"
          }
        ],
        confirmPw: [
          {
            validator: validatePassCheck,
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入电话号码",
            trigger: "blur"
          },
          {
            type: "string",
            len: 11,
            message: "无效的电话号码",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "请输入地址信息",
            trigger: "blur"
          },
          {
            type: "string",
            min: 8,
            message: "地址信息不能少于8个字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    toRegister() {
      this.$router.push("/login");
    },
    getCodeMethods() {
      let time = 60;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          this.disabled = true;
          this.getCode = "获取验证码";
        } else {
          this.getCode = time + "秒后重试";
          this.disabled = false;
          time--;
        }
      }, 1000);

      let params = {
        phone: this.registerInfo.phone
      };

      let body = this.$qs.stringify(params);

      this.$axios
        .post("/user/verify_code", body)
        .then(res => {
          console.log(res);
          if (res.data.code === 1000) {
            this.$Message.success("验证码发送成功");
            this.registerInfo.verify_token = res.data.data.token;
          } else {
            this.$Message.success("验证码发送失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleSubmit(name) {
      let body = this.$qs.stringify(this.registerInfo);
      this.$refs[name].validate(valid => {
        if (valid) {
          console.log(this.registerInfo);
          if (this.registerInfo.identity === "user") {
            this.$axios
              .post("/user/register", body)
              .then(res => {
                if (res.data.code === 1000) {
                  this.$Message.success("注册成功!");
                  this.$router.push("/login");
                } else {
                  this.$Message.error("注册失败!");
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.$axios
              .post("/shop/register", body)
              .then(res => {
                if (res.data.code === 1000) {
                  this.$Message.success("注册成功!");
                  this.$router.push("/login");
                } else {
                  this.$Message.error("注册失败!");
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          this.$Message.error("注册信息错误!");
        }
      });
    }
  }
};
</script>

<style scoped>
.register {
  height: 100%;
  overflow: hidden;
  background-image: url("../assets/image/background.jpg");
  background-size: 100% 100%;
}

.card {
  border-radius: 10px;
  background-color: rgba(91, 105, 119, 0.9);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
}

.mono {
  width: 100%;
  display: block;
  font-family: "Monoton";
  font-size: 50px;
  text-align: center;
  position: absolute;
  top: -8%;
  left: 50%;
  transform: translate(-50%, 0%);
  animation: neon 4s infinite;
}

@keyframes neon {
  0%,
  30%,
  32%,
  34% {
    color: #222;
    text-shadow: -3px 0px 5px #222, 0px 0px 2px #222;
  }

  31%,
  33%,
  35%,
  100% {
    color: #e91e63;
    text-shadow: -3px 0px 5px #222, 0px 0px 2px #e91e63;
  }
}

.card:hover {
  box-shadow: 1px 1px 10px black;
}

.form {
  margin-top: 35%;
}
.formItem {
  padding: 0 25px;
}

.formItem label {
  float: left;
  color: #f0e3c4;
  font-weight: 600;
}

.formItem .input {
  float: right;
}

.login-btn {
  padding: 0 25px;
}

.btn {
  font-weight: 500;
  display: block;
  width: 100%;
  margin: 8% auto;
}

.to-register {
  padding-right: 25px;
  text-align: right;
  width: 100%;
  display: block;
  margin: 10px auto;
  color: #f0e3c4;
  font-weight: 500;
  font-size: 12px;
}

.to-register a {
  color: #004d61;
  font-size: 12px;
  text-decoration: underline;
}
.to-register a:hover {
  color: #daa592;
}

.getCode {
  float: right;
  width: 92px;
}

.input-code {
  margin-right: 8px;
}
</style>

