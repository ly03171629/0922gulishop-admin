<template>
  <div>
    <el-card>
      <!-- 三级联动组件 -->
      <CategorySelector @handlerCategory="handlerCategory" :isShowList="isShowList"></CategorySelector>
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

              <el-popconfirm :title="`你确定要删除${row.attrName}吗？`" @onConfirm="deleteAttr(row)">
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  title="删除"
                  size="mini"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加或者修改的页面 -->
      <div v-show="!isShowList">
        <el-form :inline="true" :model="attrForm">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrForm.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrForm.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>

        <!-- 这个table是为了展示收集的属性值的列表
        收集属性名成很好收集，上面用的是v-model用户输入就直接可以收集
        收集属性值列表不好收集，那么我们采用的是先使用table去展示要收集的属性值列表
        一开始属性值列表当中是没有任何数据的，所以表格当中不会显示任何东西
        当要收集属性值的时候，用了一个占位的思想，先往数组里面添加一个属性值对象，只不过属性值的名称此时是空的
        但是，一旦添加这个属性值对象，表格当中都会出现一行，我们可以输入框再去给刚才添加的属性值对象，收集名称
        -->
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="attrForm.attrValueList"
        >
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                size="mini"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block; width: 100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`你确定要删除${row.valueName}这个属性值吗？`"
                @onConfirm="attrForm.attrValueList.splice($index, 1)"
              >
                <!-- onConfirm点击气泡确认框的确定按钮，会触发一个事件，事件名称是onConfirm，官网写错了 -->
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  title="删除属性值"
                  size="mini"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="save" :disabled="attrForm.attrValueList.length===0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],

      isShowList: true,

      attrForm: {
        attrName: "", //属性名称
        attrValueList: [
          //属性中的属性值列表
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
        // id:0
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
        attrName: "", //属性名称
        attrValueList: [
          //属性中的属性值列表
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: "string",
          // },
        ],
        categoryId: this.category3Id, //收集的属性内部这个id是3级id
        categoryLevel: 3,
      };
    },
    //点击添加属性值
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, //这个id代表的是属性值所属属性的id,有id就是修改页面，没有就增加页面undefined
        // id: 0, 新添加属性值没有id
        valueName: "", //一会需要用户输入的属性值名称
        isEdit: true, //这个属性值标识着这个属性值的模式是编辑模式，每个属性值都有这个属性要么是true要么是false
      });

      //让新添加的这个属性值input自动获取焦点
      //新添加的永远是最后一个
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },
    //点击修改属性按钮显示修改属性的页面
    showUpdateDiv(row) {
      this.isShowList = false;
      // this.attrForm = {...row}//这次这里使用浅拷贝，没办法，因为内部数组是一个对象类型，浅拷拷的还是地址，数组用的还是同一个
      this.attrForm = cloneDeep(row);
      //这里代表修改属性，修改属性的时候，属性当中已经存在了一些属性值，这些属性值我们也得添加模式
      // this.attrForm.attrValueList.forEach(item => item.isEdit = false)

      // 这里使用item.isEdit = false给每个属性值添加属性，不是响应式属性
      // vue当中对数据进行数据监视的时候，只是一开始对数据里面的所有属性做了响应式
      // Object.defineProperty对data当中的每个属性都做了getter和setter做了响应式
      // 但是如果不是一开始就有的属性，不会做监视，既然没做监视，后期添加的这个属性就不是响应式属性
      // 不是响应式属性，那么后期这个属性值改变，页面是不会改变的
      // this.$set 或者 Vue.set 为响应式对象添加新属性才是响应式属性
      this.attrForm.attrValueList.forEach((item) =>
        this.$set(item, "isEdit", false)
      );
    },

    //对input失去焦点或者回车，那么切换为查看模式
    toLook(row) {
      //1、失去焦点的时候需要判定数据中是否有属性值名称,如果没有值或者值不合法，不会变为span
      if (row.valueName.trim() === "") {
        row.valueName = "";
        return;
      }

      //2、我们还得判断当前输入的这个属性值名称，在除去自身以外，其余的属性值当中是否存在，如果存在就重复了，不能变为span
      let isRepeat = this.attrForm.attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName === row.valueName;
        }
      });

      if (isRepeat) {
        this.$message.info("输入的属性值名称不能重复");
        row.valueName = "";
        return;
      }

      row.isEdit = false;
    },
    //对span进行点击的时候，切换为编辑模式
    toEdit(row, index) {
      row.isEdit = true;

      //从span变为input我们需要自动获取焦点
      //直接写这一行，input标签其实还没有创建成功，所以报错this.$refs[index]是undefined
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },

    //保存属性操作
    async save() {
      //1、获取参数
      let attr = this.attrForm;
      //2、整理参数
      // 1、属性值名称如果为空串，从属性值列表当中去除
      // 2、属性值当中去除isEdit属性,这个isEdit是我们后面自己添加用来标识查看模式和编辑模式的
      attr.attrValueList = attr.attrValueList.filter((item) => {
        if (item.valueName !== "") {
          delete item.isEdit;
          return true;
        }
      });
      // 3、属性值列表如果没有属性值，不发请求
      if (attr.attrValueList.length === 0) {
        this.$message.info("属性值列表必须有属性值才能保存");
        return;
      }
      //3、发请求
      try {
        //4、成功干嘛
        await this.$API.attr.addOrUpdate(attr);
        this.$message.success("保存属性成功");
        this.isShowList = true;
        this.getAttrList();
      } catch (error) {
        //5、失败干嘛
        this.$message.error("保存属性失败" + error.message);
      }
    },

    //删除属性操作
    async deleteAttr(row){
      try {
        await this.$API.attr.delete(row.id)
        this.$message.success('删除属性成功')
        this.getAttrList()
      } catch (error) {
        this.$message.error('删除属性失败')
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
