<template>
  <div class="login">
    <Card :bordered="false" class="card">
      <router-link :to="'index'">
        <span class="mono">Are you hungry?</span>
      </router-link>
      <Form ref="loginInfo" :model="loginInfo" :rules="ruleInline" class="form">
        <FormItem prop="phone" class="user formItem" v-if="!showFlag">
          <label>手机:</label>
          <Input
            class="input-name input"
            v-model="loginInfo.phone"
            placeholder="输入你的手机号..."
            style="width: 200px;"
          />
        </FormItem>

        <FormItem prop="password" class="password formItem" v-if="!showFlag">
          <label>密码:</label>
          <Input
            type="password"
            class="input-password input"
            v-model="loginInfo.password"
            placeholder="输入你的密码..."
            style="width: 200px"
          />
        </FormItem>

        <FormItem prop="identity" class="identity formItem">
          <label>身份类型:</label>
          <Select
            class="input-identity input"
            v-model="loginInfo.identity"
            style="width:200px"
            @on-change="selChange"
          >
            <Option
              v-for="item in identityOptions"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>

        <div class="booth" style="display:none" ref="face">
          <video ref="video" width="200" height="150"></video>
          <canvas ref="canvas" width="200" height="150" style="opacity:0;margin-top:50px;"></canvas>
        </div>
        <button class="repeat" ref="repeat" @click="show">重新识别</button>
      </Form>
      <p class="to-register">
        没有账号？前往
        <a @click="toRegister">注册</a>
      </p>
      <div class="login-btn">
        <Button
          type="info"
          class="faceInto"
          @click="show"
          v-if="loginInfo.identity=== 'manager'"
        >选择人脸识别登录</Button>
        <Button class="btn" type="info" @click="handleSubmit('loginInfo')">Login</Button>
      </div>
    </Card>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      // 登录信息
      loginInfo: {
        phone: "",
        password: "",
        identity: ""
      },
      // 身份选择选项
      identityOptions: [
        {
          value: "user",
          label: "用户"
        },
        {
          value: "sale",
          label: "商家"
        },
        {
          value: "manager",
          label: "管理员"
        }
      ],
      // 校验规则
      ruleInline: {
        phone: [
          {
            required: true,
            message: "请填写手机号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请填写密码",
            trigger: "blur"
          },
          {
            type: "string",
            min: 5,
            message: "密码不能少于5位",
            trigger: "blur"
          }
        ],
        identity: [
          {
            required: true,
            message: "请选择身份",
            trigger: "blur"
          }
        ]
      },
      showFlag: false
    };
  },
  methods: {
    // 改变选择身份回调
    selChange(e) {
      console.log(e);
      if (e !== "manager") {
        this.$refs.face.style.display = "none";
        this.showFlag = false;
      }
    },
    toRegister() {
      this.$router.push("/register");
    },
    show() {
      this.showFlag = true;
      this.$refs.face.style.display = "block";
      let video = this.$refs.video,
        canvas = this.$refs.canvas,
        snap = this.$refs.tack,
        img = this.$refs.img,
        vendorUrl = window.URL || window.webkitURL;

      //媒体对象
      navigator.getMedia =
        navigator.getUserMedia ||
        navagator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      navigator.getMedia(
        {
          video: true, //使用摄像头对象
          audio: false //不适用音频
        },
        function(strem) {
          video.srcObject = strem;
          video.play();
        },
        function(error) {
          console.log(error);
        }
      );
      let flag = false;
      let time = 5;
      // 人脸识别定时器
      let timer = setInterval(() => {
        canvas.getContext("2d").drawImage(video, 0, 0, 200, 150);
        //把canvas图像转为img图片
        let params = {
          img: canvas.toDataURL("image/png")
        };
        let body = this.$qs.stringify(params);
        this.$axios.post("http://101.37.245.209:5050/face", body).then(res => {
          console.log(res);
          if (res.data.result === "True") {
            flag = true;
            this.setUser(res.data.data);
            sessionStorage.setItem("ayhToken", res.data.data.token);
            this.$Message.success(`${res.data.name},欢迎登录`);
            this.$router.push("/manage/manager");
            clearInterval(timer);
          }
        });
        time--;
        if (time < 0) {
          clearInterval(timer);
          this.$refs.repeat.style.display = "block";
          this.$Message.info("识别失败");
        }
      }, 1000);
    },
    // 登录提交
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // console.log(this.loginInfo);
          // 将登录信息转换成后端可处理的格式
          let body = this.$qs.stringify(this.loginInfo);
          // 用户登录
          if (this.loginInfo.identity === "user") {
            this.$axios
              .post("/user/login", body)
              .then(res => {
                if (res.data.code === 1000) {
                  console.log(res);
                  this.setUser(res.data.data);
                  sessionStorage.setItem("ayhToken", res.data.data.token);
                  this.$Message.success("登录成功!");
                  setTimeout(() => {
                    this.$router.push("/index");
                  }, 300);
                } else if (res.data.code === 1001) {
                  this.$Message.error("账号或密码错误");
                } else {
                  this.$Message.error("登录失败");
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
          // 商家登录
          if (this.loginInfo.identity === "sale") {
            this.$axios
              .post("/shop/login", body)
              .then(res => {
                if (res.data.code === 1000) {
                  console.log(res);
                  this.setSaler(res.data.data);
                  sessionStorage.setItem("ayhToken", res.data.data.token);
                  this.$Message.success("登录成功!");
                  setTimeout(() => {
                    this.$router.push("/manage/saler");
                  }, 500);
                } else if (res.data.code === 1003) {
                  this.$Message.error("用户不存在!");
                } else if (res.data.code === 1001) {
                  this.$Message.error("账号或密码错误!");
                } else {
                  this.$Message.error("登录失败!");
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
          // 管理员登录
          if (this.loginInfo.identity === "manager") {
            this.$axios.post("/admin/login", body).then(res => {
              if (res.data.code === 1000) {
                console.log(res)
                this.setUser(res.data.data);
                sessionStorage.setItem("ayhToken", res.data.data.token);
                this.$Message.success('欢迎登录');
                this.$router.push("/manage/manager");
              } else if (res.data.code === 1003) {
                this.$Message.error("用户不存在!");
              } else if (res.data.code === 1001) {
                this.$Message.error("账号或密码错误!");
              } else {
                this.$Message.error("登录失败!");
              }
            });
          }
        } else {
          this.$Message.error("登录信息错误!");
        }
      });
    },
    ...mapMutations({
      setUser: "SET_USER",
      setSaler: "SET_SALER"
    })
  }
};
</script>

<style scoped>
.login {
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
  /* height: 400px; */
}

.mono {
  width: 100%;
  display: block;
  font-family: "Monoton";
  font-size: 50px;
  text-align: center;
  position: absolute;
  top: -12%;
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
  padding: 25px, 0;
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
  margin: 15px auto;
}

.faceInto {
  font-weight: 500;
  display: block;
  width: 100%;
  margin: 15px auto;
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

.booth {
  position: relative;
  height: 150px;
  width: 200px;
  background: #ccc;
  margin: 0 auto;
}

.repeat {
  background-color: #2db7f5;
  display: none;
  border: none;
  height: 20px;
  width: 100px;
  border-radius: 5px;
  font-size: 12px;
  margin: 10px auto;
  cursor: pointer;
}
</style>
