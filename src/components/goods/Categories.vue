<template>
  <div>
    <!-- 面包屑导航 -->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <!-- 添加商品分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <!-- :selection-type="false"  关闭复选框;  :expand-type="false" 关闭展示行; -->
      <tree-table :data="catelist" :columns="columns" :expand-type="false" :selection-type="false" show-index border>
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success
          " v-if="scope.row.cat_deleted === false" style="color: green;"></i>
          <i class="el-icon-error" v-else style="color: lightred;"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 页面展示 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 3, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>


    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addCateFormClosed">
      <el-form label-width="100px" :model="addCateForm" ref="addCateFormRef" :rules="addCateFormRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader v-model="selectdKeys" :options="parentlist" :props="cascaderProps" @change="parentChange"
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script scoped>
  export default {
    name: 'Categories',
    data() {
      return {
        // 查询条件
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5,
        },
        // 商品分类的数据列表，默认为空
        catelist: [],
        // 总数据条数
        total: 0,
        // 为table指定列
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name',
          },
          {
            label: '是否有效',
            // 表示，将当前列定义为模板列
            type: 'template',
            // 表示将当前这一列使用模板名称
            template: 'isok',
          },
          {
            label: '排序',
            // 表示，将当前列定义为模板列
            type: 'template',
            // 表示将当前这一列使用模板名称
            template: 'order',
          },
          {
            label: '操作',
            // 表示，将当前列定义为模板列
            type: 'template',
            // 表示将当前这一列使用模板名称
            template: 'operation',
          },
        ],
        // 添加分类的对话框的显示与隐藏
        addDialogVisible: false,
        // 添加分类的表单数据对象
        addCateForm: {
          // 添加分类的名称
          cat_name: '',
          // 父级分类的id
          cat_pid: 0,
          // 分类的等级，默认要添加的是1级分类
          cat_level: 0,
        },
        // 添加分类的表单验证规则对象
        addCateFormRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ],
        },
        // 父级数据列表
        parentlist: [],

        // 指定级联选择器的配置对象 
        cascaderProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          checkStrictly: true,
        },
        // 选中的父级分类id数组
        selectdKeys: []
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      // 获取商品分类数据
      async getCateList() {
        const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 把数据列表，赋值给getCateList
        this.catelist = res.data.result
        // 为总数据条数赋值
        this.total = res.data.total
      },
      // 监听pagesize 的改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize,
          this.getCateList()
      },
      // 监听pagenum 的改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      // 控制添加分类对话框的显示与隐藏
      addCateDialog() {
        // 先获取父级分类的数据列表
        this.getParentList()
        console.log(this.parentlist);
        // 再展示对话框
        this.addDialogVisible = true;
      },
      updated() {
        this.getParentList()
        console.log(this.parentlist);
      },
      // 获取父级分类的数据列表
      async getParentList() {
        const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.parentlist = res.data;
        console.log(this.parentlist);
      },
      // 选择项发生改变时触发
      parentChange() {
        console.log(this.selectdKeys);
        // 如果长度大于0，说明有父级
        if (this.selectdKeys.length > 0) {
          // 父级分类的id
          this.addCateForm.cat_pid = this.selectdKeys[this.selectdKeys.length - 1];
          //  为当前分类的等级赋值
          this.addCateForm.cat_level = this.selectdKeys.length;
        } else {
          this.addCateForm.cat_pid = 0;
          this.addCateForm.cat_level = 0;
        }
      },
      // 点击确定按钮，添加新的分类
      addCate() {
        console.log(this.addCateForm);
        this.$refs.addCateFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.post('categories', this.addCateForm)
          console.log(res);
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success('添加分类成功')
          this.getCateList()
          this.addDialogVisible = false;
        })
      },
      addCateFormClosed() {
        this.$refs.addCateFormRef.resetFields()
        this.selectdKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0;
      }
    },
  };
</script>
<style>
  .el-row {
    margin-bottom: 10px;
  }

  .el-cascader {
    width: 100%;
  }

  .el-popper el-cascader__dropdown {
    top: 50px;
  }

  .el-cascader__dropdown .el-cascader-panel {
    height: 300px;
  }
</style>