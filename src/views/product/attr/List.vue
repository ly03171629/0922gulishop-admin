<template>
  <div>
    <el-card>
      <!-- 三级联动组件 -->
      <CategorySelector @handlerCategory="handlerCategory"></CategorySelector>
    </el-card>

    <el-card style="margin-top: 20px">
      <!-- 属性列表页 -->
      <div v-show="isShowList">
        <!-- 属性的列表 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="showAddDiv"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <!-- 展示属性值列表的时候，我们需要遍历v-for，而且每个属性值外部有结构，所以也得用作用域插槽-->
            <template slot-scope="{ row, $index }">
              <!-- row代表的是当前遍历的这个属性，row.attrValueList才是你要自己遍历展示的属性值列表 -->
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="warning"
                icon="el-icon-edit"
                title="修改"
                size="mini"
                @click="showUpdateDiv(row)"
              ></HintButton>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                title="删除"
                size="mini"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加或者修改的页面 -->
      <div v-show="!isShowList">
        <el-form :inline="true" :model="attrForm">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrForm.attrName"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>


        <!-- 这个table是为了展示收集的属性值的列表
        收集属性名成很好收集，上面用的是v-model用户输入就直接可以收集
        收集属性值列表不好收集，那么我们采用的是先使用table去展示要收集的属性值列表
        一开始属性值列表当中是没有任何数据的，所以表格当中不会显示任何东西
        当要收集属性值的时候，用了一个占位的思想，先往数组里面添加一个属性值对象，只不过属性值的名称此时是空的
        但是，一旦添加这个属性值对象，表格当中都会出现一行，我们可以输入框再去给刚才添加的属性值对象，收集名称
        -->
        <el-table border style="width: 100%; margin: 20px 0" :data="attrForm.attrValueList">
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值名称"></el-input>              
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <HintButton type="danger" icon="el-icon-delete" title="删除属性值" size="mini"></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],

      isShowList: true,

      attrForm:{ 
        attrName: "",  //属性名称
        attrValueList: [ //属性中的属性值列表
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: "string",
          // },
        ],
        // categoryId: this.category3Id,
        // 以后都要记住，data当中不能使用this，获取data当中的另外一个数据，因为data数据是一个对象，初始化的时候，谁先谁后不一定
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    handlerCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        //子组件重新选择1级，清空父组件当中的23级和属性列表
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        //子组件重新选择2级，清空父组件当中的3级和属性列表
        this.category3Id = "";
        this.attrList = [];
      } else if (level === 3) {
        this.category3Id = categoryId;
        //发请求拿平台属性的列表数据
        this.getAttrList();
      }
    },
    //请求获取属性的列表数据
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    //点击添加按钮显示添加的页面
    showAddDiv() {
      this.isShowList = false;
      
      //每次打开添加属性的页面得把收集的数据重置
      //在这里我们可以顺便收集categoryId
      this.attrForm = { 
        attrName: "",  //属性名称
        attrValueList: [ //属性中的属性值列表
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: "string",
          // },
        ],
        categoryId: this.category3Id, //收集的属性内部这个id是3级id
        categoryLevel: 3,
      }
    },
    //点击添加属性值
    addAttrValue(){
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, //这个id代表的是属性值所属属性的id,有id就是修改页面，没有就增加页面undefined
        // id: 0, 新添加属性值没有id
        valueName: "", //一会需要用户输入的属性值名称
      })
    },
    //点击修改属性按钮显示修改属性的页面
    showUpdateDiv(row){
      this.isShowList = false
      // this.attrForm = {...row}//这次这里使用浅拷贝，没办法，因为内部数组是一个对象类型，浅拷拷的还是地址，数组用的还是同一个
      this.attrForm = cloneDeep(row)
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
