<template>
  <div>
    <h2>我爱你赵丽颖</h2>
    <Child></Child>
  </div>
</template>

<script>
import Child from '@/views/product/scoped/Child'
export default {
  name: '',
  components:{
    Child
  }
}
</script>

<style scoped>
  div >>> h2{
    background-color: red;
  }
</style>


