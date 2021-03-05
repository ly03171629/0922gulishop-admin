<template>
  <el-card class="sku-list">
    <el-table border stripe :data="skuList" v-loading="loading">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
        row-key="id"
      >

      </el-table-column>

      <el-table-column prop="skuName" label="名称" />

      <el-table-column prop="skuDesc" label="描述" />

      <el-table-column label="默认图片" width="150" align="center">
        <template slot-scope="{ row }">
          <div class="info">
            <div class="pic">
              <img
                :src="row.skuDefaultImg"
                alt="商品图片"
                style="width: 80px"
              />
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="weight" label="重量(KG)" />

      <el-table-column prop="price" label="价格(元)" width="80" />

      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="{ row }">
          <HintButton
            v-if="row.isSale == 0"
            title="上架"
            type="info"
            size="mini"
            icon="el-icon-top"
            @click="onSale(row.id)"
          />

          <HintButton
            v-if="row.isSale == 1"
            title="下架"
            type="success"
            size="mini"
            icon="el-icon-bottom"
            @click="cancelSale(row.id)"
          />

          <HintButton
            title="修改"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="toUpdateSku(row.id)"
          />

          <HintButton
            title="查看详情"
            type="info"
            size="mini"
            icon="el-icon-info"
            @click="showSkuInfo(row.id)"
          />

          <el-popconfirm
            :title="`确定删除 ${row.skuName} 吗`"
            @onConfirm="deleteSku(row.id)"
          >
            <hint-button
              style="margin-left: 10px"
              slot="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              title="删除"
            ></hint-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      style="padding: 20px 0; text-align: center"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getSkuList"
      @size-change="changeSize"
    />

    <el-drawer :visible.sync="isShowSkuInfo" :with-header="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }} 元</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="18">
          <el-tag
            type="success"
            style="margin-right: 5px"
            v-for="value in skuInfo.skuAttrValueList"
            :key="value.id"
          >
            {{ value.attrId + "-" + value.valueId }}
          </el-tag>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel class="sku-carousel" trigger="click" height="400px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" alt="" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
  name: "SkuList",

  data() {
    return {
      skuList: [], // SKU列表
      loading: false, // 是否正在加载中
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数

      skuInfo: {},
      isShowSkuInfo: false,
    };
  },

  mounted() {
    this.getSkuList();
  },

  methods: {
    //修改sku 没有接口没法做
    toUpdateSku() {
      this.$message.info("正在开发中...");
    },

    async showSkuInfo(id) {
      this.isShowSkuInfo = true;
      const result = await this.$API.sku.get(id);
      this.skuInfo = result.data;
    },

    /*
    异步获取指定页码的sku列表
    */
    async getSkuList(page = 1) {
      this.page = page;
      this.loading = true;
      const result = await this.$API.sku.getList(this.page, this.limit);
      this.skuList = result.data.records;
      this.total = result.data.total;
      this.loading = false;
    },

    /*
    对指定SKU进行上架的请求
    */
    onSale(skuId) {
      this.$API.sku.onSale(skuId).then((result) => {
        this.$message({
          type: "success",
          message: "上架成功!",
        });
        this.getSkuList(this.page);
      });
    },

    /*
    对指定SKU进行下架的请求
    */
    cancelSale(skuId) {
      this.$API.sku.cancelSale(skuId).then((result) => {
        this.$message({
          type: "success",
          message: "下架成功!",
        });
        this.getSkuList(this.page);
      });
    },

    /*
    当页码发生改变自动调用
    */
    changeSize(size) {
      this.limit = size;
      this.getSkuList(1);
    },

    /*
    删除SKU
    */
    async deleteSku(skuId) {
      try {
        await this.$API.sku.remove(skuId);
        this.$message.success("删除SKU成功");
        this.getSkuList(1);
      } catch (error) {
        this.$message({
          message: error.message || "删除SKU失败",
          type: "error",
        });
      }
    },
  },
};
</script>
<style lang="scss">
/* 不加scoped, 可以影响子组件 */
// 添加.sku-list的目的是把所写的样式限定在本组件和本组件的子组件内部,而且不受scoped约束
// .sku-list {
//   .el-carousel__indicator {
//     button {
//       border-radius: 50%;
//       display: inline-block;
//       width: 30px;
//       height: 30px;
//       background-color: hotpink;
//     }
//     &.is-active {
//       button {
//         background-color: hotpink;
//       }
//     }
//   }
// }
</style>

<style lang="scss" scoped>
// scoped 我们当前组件的样式就被限制在本组件内部，无法影响其它组件
// 深度作用选择器  
    // scoped本身把样式限制在本组件和子组件的根元素，如果样式是作用在子组件非根元素身上，就不生效
    // 深度作用选择器的作用就是让scoped内部的样式也能作用于子组件非根元素的元素  

/*深度作用选择器的写法    ********************
  如果是原生css 深度作用选择器  
      父元素 >>> 选中的元素 
  如果是less  scss 预编译的css文件
      /deep/ 用于less
      ::v-deep  都行
      */
.sku-list {
  .el-row {
    height: 40px;
    .el-col {
      line-height: 40px;
      &.el-col-5 {
        font-size: 18px;
        font-weight: bold;
        text-align: right;
        margin-right: 20px;
      }
    }
  }

  .sku-carousel {
    width: 400px;
    border: 1px solid #ccc;
    img {
      width: 400px;
      height: 400px;
    }
  }

  ::v-deep .el-carousel__indicator{
    button{
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: hotpink;
    }
    &.is-active{
      button{
        background-color: purple;
      }
    }
  }
}
</style>