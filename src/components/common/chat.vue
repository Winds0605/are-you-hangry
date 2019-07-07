<template>
  <div class="chat">
    <Button type="primary" @click="modal1 = true" class="service">客服</Button>
    <Modal v-model="modal1" title="客服">
      <div class="talk_con">
        <div class="talk_show" ref="words">
          <div class="btalk" v-for="(item,index) in talk" :key="index">
            <span id="bsay">{{item}}</span>
          </div>
        </div>
        <div class="talk_input">
          <input type="text" class="talk_word" id="talkwords" v-model="text" />
          <input type="button" value="发送" class="talk_sub" id="talksub" @click="chat" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modal1: false,
      text: "",
      ans: "",
      talk: []
    };
  },
  methods: {
    async chat() {
      console.log(this.$refs.words.scroll())
      this.talk.push(this.text);
      this.text = "";
      let params = {
        question: this.text,
        faq_id: 110
      };
      let body = this.$qs.stringify(params);
      await this.$axios
        .post("http://api.6180339.xyz:5000/answer", body)
        .then(res => {
          console.log(res);
          if (res.data.tuling) {
            this.ans = res.data.tuling;
            this.talk.push(this.ans);
          } else {
            this.ans = res.data[0].FAQRobto_TfIdf[1];
            this.talk.push(this.ans);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.chat {
  position: fixed;
  top: 50%;
  left: 0;
}

.service {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  text-align: center;
}

.talk_con {
  width: 400px;
  height: 500px;
  border: 1px solid #666;
  margin: 50px auto 0;
  background: #f9f9f9;
}
.talk_show {
  width: 380px;
  height: 420px;
  border: 1px solid #666;
  background: #fff;
  margin: 10px auto 0;
  overflow: auto;
}

.talk-left {
  float: left;
}

.talk-right {
  float: right;
}
.talk_input {
  width: 280px;
  margin: 10px auto 0;
}
.whotalk {
  width: 80px;
  height: 30px;
  float: left;
  outline: none;
}
.talk_word {
  width: 200px;
  height: 26px;
  padding: 0px;
  float: left;
  margin-left: 10px;
  outline: none;
  text-indent: 10px;
}
.talk_sub {
  width: 56px;
  height: 25px;
  float: right;
  margin-left: 10px;
}
.talk_show .btalk:nth-child(even) {
  margin: 10px;
  text-align: left;
}

.talk_show .btalk:nth-child(even) span {
  display: inline-block;
  background: #0181cc;
  border-radius: 10px;
  color: #fff;
  padding: 5px 10px;
}

.talk_show .btalk:nth-child(odd) {
  margin: 10px;
  text-align: right;
}

.talk_show .btalk:nth-child(odd) span {
  display: inline-block;
  background: #ef8201;
  border-radius: 10px;
  color: #fff;
  padding: 5px 10px;
}

/* .atalk {
  margin: 10px;
}
.atalk span {
  display: inline-block;
  background: #0181cc;
  border-radius: 10px;
  color: #fff;
  padding: 5px 10px;
}
.btalk {
  margin: 10px;
  text-align: right;
}
.btalk span {
  display: inline-block;
  background: #ef8201;
  border-radius: 10px;
  color: #fff;
  padding: 5px 10px;
} */
</style>