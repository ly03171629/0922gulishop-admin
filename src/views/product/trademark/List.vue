<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <!-- el-table代表是表格
    表格当中是一列一列的el-table-column
    el-table:
      data="data" 这个属性是用来展示数据的，但是现在我们还没数据
      border 这个属性代表是否需要边框

    el-table-column: 
      prop="prop" 目前不用，后期需要展示数据当中的某个属性使用
      label="label" 代表这一列的名称
      width="width" 代表这一列的宽度 直接写数字，不需要px，如果不写，那么4个列平分天下，写了哪一个列，哪一个就变为自己写的宽度
      align="center" 可以让某个列中的数据居中显示
    -->
    <el-table
      border
      style="width: 100%;margin:20px 0">
      <el-table-column
        label="序号"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        label="品牌名称"
        width="width">
      </el-table-column>
      <el-table-column
        label="品牌LOGO"
        width="width">
      </el-table-column>
      <el-table-column
        label="操作"
        width="width">
      </el-table-column>
    </el-table>

    <!-- 分页器 
    之前我们用的分页器是自己封装的分页器组件
    这次我们用的是element-ui给我们封装的分页器组件
    :current-page="pageNum"  传递的当前页码  
    :page-size="pageSize"    传递的每页数量
    :total="totalCount"      传递的总数
    :pager-count="3"         传递的连续页数
    @current-change="handleCurrentChange"  切换页面的事件

    以前没写过的
    :page-sizes="[10, 20, 50]" 在页面可以改变当前页的数量
    @size-change="handleSizeChange" 改变当前页数量的事件

    layout="total, sizes, prev, pager, next, jumper" //可以改变分页器前后顺序（布局顺序）

    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    
    -->
    <el-pagination
      style="text-align:center"
      :current-page="1"
      :page-size="3"
      :total="10"
      :pager-count="5"
      :page-sizes="[10, 20, 50]"
      layout="prev, pager, next, jumper,->,sizes,total"
      >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data(){
    return {
      page:1,
      limit:3,
      trademarkList:[],
      total:0
    }
  },
  mounted(){
    this.getTrademarkList()
  },
  methods:{
    async getTrademarkList(){
      const result = await this.$API.trademark.getPageList(this.page,this.limit)
      if(result.code === 200){
        this.trademarkList = result.data.records
        this.total = result.data.total
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
