<template>
  <div>
    <el-button type="primary" v-if="$hasBP('btn.Test111.add')">添加</el-button>
    <el-button type="danger" v-if="$hasBP('btn.Test111.remove')">删除</el-button>
    <el-button type="warning" v-if="$hasBP('btn.Test111.update')">修改</el-button>
  </div>
</template>

<script>
export default {
  name: '',
}
</script>

