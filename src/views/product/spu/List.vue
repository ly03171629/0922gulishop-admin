<template>
  <div>
    <el-card>
      <!-- 三级联动组件 -->
      <CategorySelector
        @handlerCategory="handlerCategory"
        :isShowList="isShowList"
      ></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- spu的列表页 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="showAddSpuForm">添加SPU</el-button>
        <el-table :data="spuList" border style="width: 100%">
          <el-table-column label="序号" type="index" align="center" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="showAddSkuForm(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="showUpdateSpuForm(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SPU的SKU列表"
              ></HintButton>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除SPU"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <!-- @size-change="handleSizeChange"
        @current-change="handleCurrentChange" -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[2, 4, 6]"
          :page-size="limit"
          :total="total"
          :pager-count="5"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          layout=" prev, pager, next, jumper,->,sizes,total"
        >
        </el-pagination>
      </div>

      <!-- spu的添加和修改页面 -->
      <!-- <div> 
      </div> -->
      <!-- <SpuForm v-show="isShowSpuForm" :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event"></SpuForm> -->
      <SpuForm v-show="isShowSpuForm" :visible.sync="isShowSpuForm" ref="spu" ></SpuForm>

      <!-- sku的添加页面 -->
      <!-- <div>
      </div> -->
      <SkuForm v-show="isShowSkuForm"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from '@/views/product/components/SpuForm'
import SkuForm from '@/views/product/components/SkuForm'
export default {
  name: "Spu",
  components:{
    SpuForm,
    SkuForm
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],

      //有分页就得有这三个数据
      page: 1,
      limit: 2,
      total: 0,

      isShowList: true, //这个数据是为了完成三级分类的可操作性传递过去的,和咱们这边的三个页面显示隐藏没关系


      //三个页面显示隐藏是通过下面这两个数据实现
      isShowSpuForm:false,
      isShowSkuForm:false

    };
  },
  methods: {
    handlerCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
        this.spuList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.spuList = [];
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    //获取spu分页列表
    async getSpuList(pager = 1) {
      this.page = pager;
      let { page, limit, category3Id } = this;
      const result = await this.$API.spu.getList(page, limit, category3Id);
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },

    //修改每页数量的回调
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },

    //点击添加SPU的回调，显示SPU的添加页面
    showAddSpuForm(){
      this.isShowSpuForm = true
      //获取到子组件对象，调用子组件里面的方法，进行发请求
      this.$refs.spu.getAddSpuFormInitData()
    },
    //点击修改spu的回调，显示Spu的修改页面（其实和添加是同一个页面）
    showUpdateSpuForm(row){
      this.isShowSpuForm = true
      this.$refs.spu.getUpdateSpuFormInitData(row)
    },
    //点击添加SKU的回调，显示添加SKU的页面
    showAddSkuForm(row){
      this.isShowSkuForm = true
    }


  },
};
</script>

<style lang="scss" scoped>
</style>
