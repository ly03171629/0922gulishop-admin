<template>
  <div>
    <el-card>
      <!-- 三级联动组件 -->
      <CategorySelector @handlerCategory="handlerCategory"></CategorySelector>
    </el-card>

    <el-card style="margin-top:20px">
      <!-- 属性的列表 -->
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  data(){
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      attrList:[],
    }
  },
  methods:{
    handlerCategory({categoryId,level}){
      if(level === 1){
        this.category1Id = categoryId
        //子组件重新选择1级，清空父组件当中的23级和属性列表
        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []

      }else if(level === 2){
        this.category2Id = categoryId
        //子组件重新选择2级，清空父组件当中的3级和属性列表
        this.category3Id = ''
        this.attrList = []

      }else if(level === 3){
        this.category3Id = categoryId
        //发请求拿平台属性的列表数据
        this.getAttrList()
      }
    },
    //请求获取属性的列表数据
    getAttrList(){

    }

  }
}
</script>

<style lang="scss" scoped>

</style>
