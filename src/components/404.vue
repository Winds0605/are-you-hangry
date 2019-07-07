<template>
  <div class="notfound">
    <router-link :to="'/index'">
      <Button type="dashed" class="to-index">点此处返回首页</Button>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.notfound {
  height: 100%;
  background-image: url(".././assets/image/404.jpeg");
  background-repeat: no-repeat;
  background-size: 70% 100%;
  background-position: center;
}

.to-index {
  margin: 20px;
}
</style>