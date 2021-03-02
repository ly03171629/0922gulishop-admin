<template>
  <div>
    <el-form :model="spuForm">
      <el-form-item label="SPU名称" label-width="100px">
        <el-input placeholder="SPU名称" v-model="spuForm.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌" label-width="100px">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- element-ui里面没有textarea，也是使用input去做 -->
      <el-form-item label="SPU描述" label-width="100px">
        <el-input
          placeholder="SPU描述"
          type="textarea"
          rows="4"
          v-model="spuForm.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片" label-width="100px">
        <!-- :file-list="fileList" 指定我们图片展示的是哪个数组 -->
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性" label-width="100px">
        <el-select value="" placeholder="还有1未选择">
          <el-option label="label" value="value"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table border style="width: 100%" :data="spuForm.spuSaleAttrList">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!--  @close="handleClose(tag)"点击×的回调 -->
              <el-tag
                closable
                :disable-transitions="false"
                v-for="(saleAttrValue, index) in row.spuSaleAttrValueList" :key="saleAttrValue.id"
              >
                {{ saleAttrValue.saleAttrValueName}}
              </el-tag>

              <!--  @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
              >
              </el-input>
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row,$index}">
              <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除销售属性"></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label-width="100px">
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  props: ["visible"],
  data() {
    return {
      // 和upload相关的动态数据
      dialogImageUrl: "",
      dialogVisible: false,

      spuForm: {
        category3Id: "",
        description: "",
        // id: 0,
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuName: "",
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
        tmId: "",
      },
      //这个spuForm我们内部初始化属性都是空的，是为添加spu的时候收集数据用的
      //修改spu的时候，这个spuForm就会被赋值为请求回来的有数据的对象
      // spuForm :{
      //   category3Id:61,
      //   description:"HUAWEI P40",
      //   id:4,
      //   spuImageList:null,
      //   spuName:"HUAWEI P40",
      //   spuSaleAttrList:Array[2],
      //   tmId:3
      // }

      spuImageList: [], //请求初始化的spu图片列表
      trademarkList: [], //请求初始化的所有品牌列表
      saleAttrList: [], //请求初始化的所有的销售属性列表
    };
  },
  methods: {
    // 和upload相关的回调函数
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    //请求获取修改spu的初始化数据
    async getUpdateSpuFormInitData(spu) {
      //发4个请求
      //根据spu的id获取spu的详情
      //http://localhost:9529/dev-api/admin/product/getSpuById/4
      const result = await this.$API.spu.get(spu.id);
      if (result.code === 200) {
        this.spuForm = result.data;
      }
      //根据spu的id获取spu的图片列表
      //http://localhost:9529/dev-api/admin/product/spuImageList/4
      const imageResult = await this.$API.sku.getSpuImageList(spu.id);
      if (imageResult.code === 200) {
        let spuImageList = imageResult.data;
        // 我们为了让upload可以展示图片列表，必须把请求回来的图片当中添加上name和url

        spuImageList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = spuImageList;
      }

      //获取所有的品牌列表
      //http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      const trademarkResult = await this.$API.trademark.getList();
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }

      //获取所有的销售属性列表
      //http://localhost:9529/dev-api/admin/product/baseSaleAttrList
      const saleAttrResult = await this.$API.spu.getSaleAttrList();
      if (saleAttrResult.code === 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },

    //请求获取添加spu的初始化数据
    async getAddSpuFormInitData() {
      //发两个请求
      //获取所有的品牌列表
      //http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      const trademarkResult = await this.$API.trademark.getList();
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }

      //获取所有的销售属性列表
      //http://localhost:9529/dev-api/admin/product/baseSaleAttrList
      const saleAttrResult = await this.$API.spu.getSaleAttrList();
      if (saleAttrResult.code === 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },
  },
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>