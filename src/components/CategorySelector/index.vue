<template>
  <div>
    <!-- CategorySelector -->
    <el-form :inline="true"  class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <!-- select必须有value属性，如果没有会报警告 -->
        <el-select v-model="cForm.category1Id"  placeholder="请选择" @change="handlerCategory1">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in category1List" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <!-- select必须有value属性，如果没有会报警告 -->
        <el-select v-model="cForm.category2Id"  placeholder="请选择" @change="handlerCategory2">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in category2List" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <!-- select必须有value属性，如果没有会报警告 -->
        <el-select v-model="cForm.category3Id"  placeholder="请选择" @change="handlerCategory3">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in category3List" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  data(){
    return {
      category1List:[],
      category2List:[],
      category3List:[],
      cForm:{
        category1Id:'',
        category2Id:'',
        category3Id:''
      }
    }
  },
  mounted(){
    this.getCategory1List()
  },
  methods:{
    async getCategory1List(){
      const result = await this.$API.category.getCategory1()
      if(result.code === 200){
        this.category1List = result.data
      }
    },
    //选中了1级分类的回调
    async handlerCategory1(category1Id){
      //用户选中1级需要清空23级
      this.category2List = []
      this.category3List = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''

      //选中1级要触发自定义事件 把1级的id传递给父组件
      // this.$emit('handlerCategory',category1Id) //因为我们传递的id区分不了是几级id
      this.$emit('handlerCategory',{categoryId:category1Id,level:1})


      const result = await this.$API.category.getCategory2(category1Id)
      if(result.code === 200){
        this.category2List = result.data
      }
    },
    //选中了2级分类的回调
    async handlerCategory2(category2Id){
      //选中2级需要把3级清空
      this.category3List = []
      this.cForm.category3Id = ''

      //选中2级要触发自定义事件 把2级的id传递给父组件
      // this.$emit('handlerCategory',category2Id)
      this.$emit('handlerCategory',{categoryId:category2Id,level:2})

      const result = await this.$API.category.getCategory3(category2Id)
      if(result.code === 200){
        this.category3List = result.data
      }
    },
    handlerCategory3(category3Id){
      //三级选中
      //选中3级要触发自定义事件 把3级的id传递给父组件
      // this.$emit('handlerCategory',category3Id)
      this.$emit('handlerCategory',{categoryId:category3Id,level:3})
    }

  }
};
</script>

