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
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlePictureSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性" label-width="100px">
        <el-select
          v-model="unUseSaleAttrIdName"
          :placeholder="
            unUseSaleAttrList.length > 0
              ? `还有${unUseSaleAttrList.length}未选择`
              : '没有啦！！！'
          "
        >
          <el-option
            :label="unUseSaleAttr.name"
            :value="`${unUseSaleAttr.id}:${unUseSaleAttr.name}`"
            v-for="(unUseSaleAttr, index) in unUseSaleAttrList"
            :key="unUseSaleAttr.id"
          ></el-option>
        </el-select>

        <el-button type="primary" icon="el-icon-plus" @click="addSaleAttr" :disabled="!unUseSaleAttrIdName">添加销售属性</el-button>
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
                v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              >
                {{ saleAttrValue.saleAttrValueName }}
              </el-tag>

              <!--   -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <!--  -->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除销售属性"
              ></HintButton>
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
              // {
              //   baseSaleAttrId: 0,
              //   id: 0,
              //   isChecked: "string",
              //   saleAttrName: "string",
              //   saleAttrValueName: "string",
              //   spuId: 0,
              // },
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

      unUseSaleAttrIdName: "", //收集的选择未使用的销售属性的id和name
    };
  },
  methods: {
    // 和upload相关的回调函数，对应删除图片成功后的回调，对应的就是图片的垃圾筐
    handleRemove(file, fileList) {
      // 删除图片的时候我们需要收集新的图片列表
      // console.log(file, fileList);
      this.spuImageList = fileList
    },

    //这个方法代表上传成功后的回调
    handlePictureSuccess(res,file,fileList){
      //上传成功，也得把最后的图片列表收集起来
      console.log(fileList);
      this.spuImageList = fileList
    },

    //这个方法是预览大图使用，已经写好，不用动，对应的就是图片的放大镜
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url; //把需要放大的图片src赋值到对话框当中的图片
      this.dialogVisible = true; //弹出放大图片的对话框
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
    //点击添加销售属性
    addSaleAttr(){
      //点击按钮，通过刚才选择select收集到的数据，获取收集到的销售属性id和name
      let [baseSaleAttrId,saleAttrName] = this.unUseSaleAttrIdName.split(':')
      // 把收集到的数据变为要添加的对象格式
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      // 把销售属性对象添加到spu的销售属性列表当中
      this.spuForm.spuSaleAttrList.push(obj)

      this.unUseSaleAttrIdName = '' //清空收集的数据
    },
    //点击销售属性值列表当中的添加按钮
    showInput(row){
      // row.inputVisible = true
      this.$set(row,'inputVisible',true)

      //自动获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    //当用户输入销售属性值完成后失去焦点或者回车的回调
    handleInputConfirm(row){
      let saleAttrValueName = row.inputValue
      let baseSaleAttrId = row.baseSaleAttrId

      //拿到属性值名称，判断是否是空串
      if(saleAttrValueName.trim() === ''){
        row.inputValue = ''
        return
      }
      //判断当前这个销售属性值名称是否已经在销售属性值列表当中存在，这里不需要除去自身
      //因为我们现在还没有把这个销售属性值添加到指定的位置
      //之前平台属性要去除去自身，因为之前我们平台属性用的是占位思想，还没有输入平台属性值名称，就已经添加了这个平台属性值，因此要出去自身
      let isRepeat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === saleAttrValueName)
      if(isRepeat){
        this.$message.info('销售属性值名称不能重复')
        row.inputValue = ''
        return
      }

      //销售属性值名称没问题，我们就构造成我们需要的销售属性值对象
      let obj = {
        saleAttrValueName,
        baseSaleAttrId
      }

      row.spuSaleAttrValueList.push(obj) //把销售属性值添加到指定的销售属性值列表

      //把input再变为按钮
      row.inputVisible = false

      //将input当中的数据清空
      row.inputValue = '' 
    }
  },
  computed: {
    //根据请求获取的所有的销售属性列表saleAttrList和spu详情当中自己的销售属性列表spuForm.spuSaleAttrList 计算得到未选择的销售属性列表
    unUseSaleAttrList() {
      //从所有的销售属性列表当中过滤，不在spu自己的销售属性列表当中的 所有销售属性
      // return this.saleAttrList.filter(saleAttr => {
      //   return this.spuForm.spuSaleAttrList.every(spuSaleAttr => {
      //     return spuSaleAttr.saleAttrName !== saleAttr.name
      //   })
      // })
      return this.saleAttrList.filter((saleAttr) =>
        this.spuForm.spuSaleAttrList.every(
          (spuSaleAttr) => spuSaleAttr.saleAttrName !== saleAttr.name
        )
      );
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