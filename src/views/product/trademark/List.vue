<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >

    <!-- el-table代表是表格
    表格当中是一列一列的el-table-column
    el-table:
      data="data" 这个属性是用来展示数据的，但是现在我们还没数据,data必须是一个数组
                  表格展示数据的时候，数据的格式必须是数组，数组内部是对象
      border 这个属性代表是否需要边框

    el-table-column: 
      prop="prop" 目前不用，后期需要展示数据当中的某个属性使用
      label="label" 代表这一列的名称
      width="width" 代表这一列的宽度 直接写数字，不需要px，如果不写，那么4个列平分天下，写了哪一个列，哪一个就变为自己写的宽度
      align="center" 可以让某个列中的数据居中显示
    -->

    <!-- 
      table当中:data="trademarkList"，代表的是表格要展示的数组
      当我们写上这个的时候，table会把这个数组给每个列传递一份
      每个列内部都是在展示我们的这个数组数据 v-for
      每个列在展示数据的时候，结构是由咱们自己说的算
      其实我们大家要明白，table列内部是有作用域插槽的

      table的列在展示数据的时候，如果我们的数据就是要展示的数据，那么直接写prop就行
      如果我们的数据不是直接展示的数据，而是需要其它的结构，那么必须使用作用域插槽
    -->
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" align="center" width="80">
      </el-table-column>

      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>

      <el-table-column label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <!-- row就代表当前遍历的对象
          $index代表当前遍历的对象的下标 -->
          <img :src="row.logoUrl" alt="" style="height: 60px; width: 80px" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 
    之前我们用的分页器是自己封装的分页器组件
    这次我们用的是element-ui给我们封装的分页器组件
    :current-page="pageNum"  传递的当前页码  
    :page-size="pageSize"    传递的每页数量
    :total="totalCount"      传递的总数
    :pager-count="5"         传递的连续页数，如果写的是5，连续数是3 5包含了首页和尾页
    @current-change="handleCurrentChange"  切换页面的事件

    以前没写过的
    :page-sizes="[10, 20, 50]" 在页面可以改变当前页的数量
    @size-change="handleSizeChange" 改变当前页数量的事件

    layout="total, sizes, prev, pager, next, jumper" //可以改变分页器前后顺序（布局顺序）

    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    
    -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :pager-count="5"
      @current-change="getTrademarkList"
      :page-sizes="[3, 5, 10]"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper,->,sizes,total"
    >
    </el-pagination>

    <!-- 点击添加或点击修改弹出的对话框页面 
    写静态页面的时候把东西复制过来，先把内部所有的动态数据删除掉-->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="tmForm">
        <!-- el-form代表的是表单
        表单里面是表单项
            每个表单项都可以通过label-width设置表单项名称的宽度
            每个表单项都可以通过label设置表单项名称
        form当中都会写：model="对象" 作用：1、以后用来去对这个form表单验证 2、用来标识这个form收集的数据收集到哪
        -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 在拷贝upload组件的时候，把html  css   js相关的东西全拷贝 -->
          <!-- action 控制的是上传的接口地址 -->
          <!-- 上传图片分为两步：
          我们在上传的时候需要调用接口，把本地的图片传到后端服务器
          接下来，后端服务器会给我们返回这个图片在后端服务器上的地址（线上路径）
          我们要收集的东西就是返回来的这个路径 -->
          <!-- 
            上传的接口地址，前面必须添加/dev-api
            action="/dev-api/admin/product/fileUpload"
            如果不添加在默认是往这发请求 http://localhost:9528/admin/product/fileUpload   404
            如果添加了往这发http://localhost:9528/dev-api/admin/product/fileUpload  就会背代理转发到真实的地址
            http://182.92.128.115/admin/product/fileUpload  是对的
          -->

          <!-- :show-file-list="false"代表显示的只有一张图片，不是多个（照片墙） 
          :on-success="handleAvatarSuccess" 代表图片上传成功后的回调
          :before-upload="beforeAvatarUpload" 代表图片上传前的回调
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg文件，且不超过2M
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    var validateTmName = (rule, value, callback) => {
      //value 就是后期要验证的用户输入的数据
      //callback 是一个回调函数，如果callback调用的时候传递了参数，代表验证失败，如果没有传递参数，代表验证成功
      if (value.length < 2 || value.length > 20) {
        callback(new Error("tmName长度必须是2-20之间"));
      } else {
        callback()
      }
    };

    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,

      dialogFormVisible: false, //这个数据决定了dialog是不是显示
      // imageUrl: "", //upload组件内部的数据，有可能不用
      //tmForm就是我们收集成功的哪个品牌对象
      tmForm: {
        tmName: "", //收集我们的品牌名称
        logoUrl: "", //收集我们的品牌logo图片路径
      }, //用来收集数据的

      rules: {
        //规则
        //每个要验证的字段规则都是一个数组
        //数组里面是对象，每一个对象就代表是验证的一个规则
        //每个规则对象里面包含三个东西：1、规则 2、错误提示信息 3、触发时机（验证时机）
        //触发时机：一共有三个  失去焦点的时候blur  内容改变的时候change  整体验证的时候
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // {
          //   min: 2,
          //   max: 10,
          //   message: "长度在 2 到 10 个字符",
          //   trigger: "change",
          // },
          { validator: validateTmName, trigger: "change" }, //自定义校验规则
        ],
        logoUrl: [
          { required: true, message: "请上传图片" }, //这个触发是在整体验证的时候触发
        ],
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },

    //这个是切换分页器页码的回调
    // handleCurrentChange(page){
    //   this.page = page
    //   this.getTrademarkList()
    // }

    //这个是切换每页数量的回调,这个回调不能省略
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },

    //upload组件当中写的两个函数

    //图片上传成功的回调
    handleAvatarSuccess(res, file) {
      //res代表上传成功后返回的响应数据
      //file代表上传成功后返回的图片文件本身
      // console.log(res,file)

      //本身写的东西，这个是错的，它也是在收集上传成功的图片路径，但是这样的写法只是模拟
      //它最终收集的是本地的路径,是错的，我们要的是上传成功后服务器返回来的线上路径
      // this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(URL.createObjectURL(file.raw))
      //blob:http://localhost:9528/6cf4d647-e84e-4869-9662-1800c552c8e0

      this.tmForm.logoUrl = res.data; //或者是file.response.data
    },
    //图片上传前的回调
    //就是在上传的时候可以限制图片的格式和大小
    beforeAvatarUpload(file) {
      //file代表的是你上传的那个图片
      const isJPG = file.type === "image/jpeg"; //判断上传的图片是否是jpg格式
      const isLt2M = file.size / 1024 / 1024 < 2; //判断上传的图片大小是不是小于2M

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //点击添加按钮弹出添加品牌的dialog对话框
    showAddDialog() {
      this.dialogFormVisible = true;
      //把tmForm内的数据清空 如果不清空，添加数据点取消，再点添加，数据还存在
      this.tmForm = {
        tmName: "", //收集我们的品牌名称
        logoUrl: "", //收集我们的品牌logo图片路径
      };
    },

    // 点击修改弹出修改品牌的dialog对话框
    showUpdateDialog(row) {
      this.dialogFormVisible = true;
      // this.tmForm = row //row代表的就是要修改的那一行，就是要修改的品牌对象
      //row是列表页当中展示的数据
      //tmForm是dialog对话框展示的数据
      //this.tmForm = row是把列表页的数据地址给了tmForm 让tmForm和row就是同一个数据
      //深浅拷贝
      //拷贝？
      // var a = [1,2,3]  var b = a   是不是拷贝？
      // 不是拷贝
      // 什么是拷贝，必须出现另外一个内存空间  叫拷贝
      // 深浅拷贝  说的是拷贝过程中数据的类型问题
      // 深浅拷贝面向的数据必然是对象格式，基本数据类型，不存在深浅拷贝

      // 浅拷贝：对象当中所有的对象数据在拷贝给另外一个内存的时候，拷贝地址
      // 深拷贝：对象当中所有的对象数据在拷贝给另外一个内容的时候，拷贝数据而不是地址

      // tmForm = {
      //   tmName:'aa', //收集我们的品牌名称
      //   logoUrl:'bb', //收集我们的品牌logo图片路径
      //   data:[1,2,3] //0x100
      // }
      // //如果是浅拷贝
      // tmFormCopy = {
      //   tmName:'aa',
      //   logoUrl:'bb',
      //   data:[1,2,3]//0x100
      // }

      // //如果是深拷贝
      // tmFormDeepCopy = {
      //   tmName:'aa',
      //   logoUrl:'bb',
      //   data:[1,2,3]//0x200
      // }
      //我们这里row当中只有基本数据类型，所以说我们浅拷贝就ok，没必要深拷贝，深拷贝页可以
      this.tmForm = { ...row }; //最简单的浅拷贝对象
    },

    //点击确定按钮发请求添加或者修改品牌
    addOrUpdateTrademark() {
      //整体验证
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {
          //获取参数
          let trademark = this.tmForm; //tmForm就是咱们添加或者修改最终收集到的品牌数据
          //整理参数 一般是我们的参数数据不符合咱们请求的参数格式，那么就需要整理

          //发请求
          try {
            //成功干啥
            await this.$API.trademark.addOrUpdate(trademark);
            //1、提示
            this.$message.success(
              trademark.id ? "修改品牌成功" : "添加品牌成功"
            );
            //2、关闭dialog,回到列表页
            this.dialogFormVisible = false;
            //3、重新发请求获取列表页数据
            // 如果添加成功，那么重新请求的是第一页数据，添加新的数据是在最后一页
            // 如果是修改成功，那么我们得重新请求这条数据所在的页
            this.getTrademarkList(trademark.id ? this.page : 1);
          } catch (error) {
            //失败干啥
            this.$message.error(trademark.id ? "修改品牌失败" : "添加品牌失败");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //点击删除按钮，删除对应的品牌
    deleteTrademark(row) {
      this.$confirm(`你确定要删除${row.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //then处理的就是点击确定按钮的逻辑
          //点击消息盒子确定按钮后要发请求去删除
          try {
            await this.$API.trademark.delete(row.id);
            //1、删除成功后提示
            this.$message.success("删除品牌成功");
            // this.$message({
            //   type: "success",
            //   message: "删除成功!",
            // });
            //2、重新发请求获取列表数据
            // 正常删除哪个数据回到的还是哪个数据所在的页面
            // 假设删除数据的那一页只有一条数据，我们需要回到前一页，而不是数据当前页
            this.getTrademarkList(
              this.trademarkList.length > 1 ? this.page : this.page - 1
            );
          } catch (error) {
            this.$message.error("删除品牌失败");
          }
        })
        .catch(() => {
          //处理的是点击取消按钮的逻辑
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
