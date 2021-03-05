<template>
  <div>
    <el-form :model="skuForm">
      <el-form-item label="SPU名称" label-width="100px">
        {{ spu.spuName }}
      </el-form-item>

      <el-form-item label="SKU名称" label-width="100px">
        <el-input placeholder="SKU名称" v-model="skuForm.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)" label-width="100px">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuForm.price"
        ></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)" label-width="100px">
        <el-input
          placeholder="重量(千克)"
          type="number"
          v-model="skuForm.weight"
        ></el-input>
      </el-form-item>

      <el-form-item label="规格描述" label-width="100px">
        <el-input
          placeholder="规格描述"
          type="textarea"
          rows="4"
          v-model="skuForm.skuDesc"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性" label-width="100px">
        <el-form :inline="true">
          <el-form-item
            :label="attr.attrName"
            label-width="100px"
            v-for="(attr, index) in attrList"
            :key="attr.id"
          >
            <el-select v-model="attr.attrIdValueId" placeholder="请选择">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性" label-width="100px">
        <el-form :inline="true">
          <el-form-item
            :label="saleAttr.saleAttrName"
            label-width="100px"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              v-model="saleAttr.saleAttrIdValueId"
              placeholder="请选择"
            >
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表" label-width="100px">
        <el-table
          :data="spuImageList"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                v-if="row.isDefault === '0'"
                type="primary"
                size="mini"
                @click="setDefaultImg(row, spuImageList)"
                >设为默认</el-button
              >
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label-width="100px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spu: {},
      attrList: [],
      spuSaleAttrList: [],
      spuImageList: [], //请求获取的spu的图片列表，需要在页面展示

      skuImageList: [], //我们选择了spu的图片列表后组成的sku图片列表，收集到这里

      skuForm: {
        //从父组件传过来的
        spuId: "",
        category3Id: "",
        tmId: "",

        // createTime: "2021-03-03T07:17:36.281Z",
        // id: 0,
        // isSale: 0,
        //咱们通过v-model直接收集
        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",

        //通过自己写代码收集
        // sku的平台属性值列表，是由用户选择平台属性的值所决定的
        // 选择了一个平台属性值，那么列表当中就多了一个平台属性值对象
        // 没有选择，那就没有
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // }
        ],

        skuDefaultImg: "", //默认图片的路径

        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],

        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
    };
  },
  methods: {
    async getAddSkuFormInitData(row, category1Id, category2Id) {
      this.spu = row;
      //根据123级分类获取平台属性列表
      //http://localhost:9529/dev-api/admin/product/attrInfoList/2/13/61
      const promise1 = this.$API.attr.getList(
        category1Id,
        category2Id,
        row.category3Id
      );
      //根据spu的id获取spu的销售属性列表
      //http://localhost:9529/dev-api/admin/product/spuSaleAttrList/4
      const promise2 = this.$API.sku.getSpuSaleAttrList(row.id);
      //根据spu的id获取spu的图片列表
      //http://localhost:9529/dev-api/admin/product/spuImageList/4
      const promise3 = this.$API.sku.getSpuImageList(row.id);

      const result = await Promise.all([promise1, promise2, promise3]);
      // result 是promise1,promise2,promise3成功结果的数组
      this.attrList = result[0].data;
      this.spuSaleAttrList = result[1].data;

      let spuImageList = result[2].data;
      //这样做可以避免每个图片后期都要使用$set
      //因为在这里我们添加好属性，后面我们是直接把数组赋值给响应式属性this.spuImageList，所以内部的东西也是响应式
      spuImageList.forEach((item) => (item.isDefault = "0"));
      this.spuImageList = spuImageList;
    },

    //收集sku图片列表的回调
    //sku的图片列表是从spu的图片列表当中选择来的，选择了几个，那么这个选择的组成数组变为sku的图片列表
    handleSelectionChange(val) {
      this.skuImageList = val;
    },
    //设置默认图片
    setDefaultImg(row, spuImageList) {
      spuImageList.forEach((item) => (item.isDefault = "0"));
      row.isDefault = "1";

      // 此时就是手机默认图片路径的最佳时机
      this.skuForm.skuDefaultImg = row.imgUrl;
    },
    //添加sku的保存操作
    async save() {
      //获取参数数据
      let { spu, skuForm, attrList, spuSaleAttrList, skuImageList } = this;
      //整理参数
      //整理父组件传递过来的三个数据
      skuForm.spuId = spu.id;
      skuForm.category3Id = spu.category3Id;
      skuForm.tmId = spu.tmId;
      //整理图片列表
      //最终需要的
      // {
      //   imgName: "string",
      //   imgUrl: "string",
      //   isDefault: "string",
      //   spuImgId: 0,
      // },

      //我们目前的图片结构
      // id:21
      // imgName:"76c7922bb9d226d0.jpg"
      // imgUrl:"http://47.93.148.192:8080/group1/M00/00/02/rBHu8l-sklaAPVqkAAEoiSa9WoM463.jpg"
      // isDefault:"0"
      // spuId:4
      
      skuImageList = skuImageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });

      skuForm.skuImageList = skuImageList;

      //整理sku的平台属性值列表和销售属性值列表
      // attrIdValueId和saleAttrIdValueId
      skuForm.skuAttrValueList = attrList.reduce((prev, item) => {
        // 判断哪个平台属性当年被选择过属性值
        if (item.attrIdValueId) {
          // 把收集的数据转化为需要的属性值结构
          let [attrId, valueId] = item.attrIdValueId.split(":");
          let obj = { attrId, valueId };
          prev.push(obj);
        }
        return prev;
      }, []);

      skuForm.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdValueId) {
          let [saleAttrId, saleAttrValueId] = item.saleAttrIdValueId.split(":");
          let obj = { saleAttrId, saleAttrValueId };
          prev.push(obj);
        }
        return prev;
      }, []);

      //发请求
      try {
        //成功干嘛
        await this.$API.sku.addUpdate(skuForm);
        //提示
        this.$message.success("保存sku成功");
        //返回到spu列表页面.不需要重新获取spu列表数据
        this.$emit("update:visible", false);
        //清空sku相关data数据
        this.resetData();
      } catch (error) {
        //失败干嘛
        this.$message.success("保存sku失败");
      }
    },

    // 清空data数据
    resetData() {
      this.spu = {};
      this.attrList = [];
      this.spuSaleAttrList = [];
      this.spuImageList = [];
      this.skuImageList = [];
      this.skuForm = {
        spuId: "",
        category3Id: "",
        tmId: "",
        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",
        skuAttrValueList: [],
        skuDefaultImg: "", //默认图片的路径
        skuImageList: [],
        skuSaleAttrValueList: [],
      };
    },

    //添加sku的取消操作
    cancel(){
      //返回列表页
      this.$emit('update:visible',false)
      //清空sku的数据
      this.resetData()
    }
  },
};
</script>

