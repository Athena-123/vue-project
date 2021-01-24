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

    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告信息 -->
      <el-row>
        <el-col>
          <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false">
          </el-alert>
        </el-col>
      </el-row>

      <!-- 选择商品分类 -->
      <el-row class="classify">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader :options="paramslist" :props="paramsProps" v-model="selectCateKeys" @change="handleChange"
            style="width: 50%;">
          </el-cascader>
        </el-col>
      </el-row>


      <!-- 标签页 -->
      <template>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">

          <!-- 添加动态参数的面板 -->
          <el-tab-pane label="动态参数" name="many">
            <!-- 添加参数的按钮 -->
            <el-button type="primary" size="small" :disabled="idBtnDisabled" @click="addParamsDialogVisible=true">添加参数
            </el-button>
            <!-- 表格区 -->
            <el-table border style="width: 100%" :data='manyTabList'>
              <!-- 展开行 -->
              <el-table-column type="expand" width="50">
                <template slot-scope="scope">
                  <el-tag v-for='(item,index) in scope.row.attr_vals' :key="index" closable
                    @close="handleClose(index,scope.row)">
                    {{item}}
                  </el-tag>
                  <!-- 动态切换按钮或表单 -->
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)" style="width: 130px;">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" width="50">
              </el-table-column>
              <el-table-column label="参数名称" prop="attr_name">
              </el-table-column>
              <el-table-column label="操作" prop="attr_write">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑
                  </el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- 添加静态参数的面板 -->
          <el-tab-pane label="静态属性" name="only">
            <!-- 添加属性的按钮 -->
            <el-button type="primary" size="small" :disabled="idBtnDisabled" @click="addParamsDialogVisible=true" >添加属性
            </el-button>
            <!-- 属性列表数据 -->
            <el-table border style="width: 100%" show-header :data='onlyTabList'>
              <el-table-column type="expand" width="50">
                <template slot-scope="scope">
                  <el-tag v-for='(item,index) in scope.row.attr_vals' :key="index" closable @close="handleClose(index,scope.row)">
                    {{item}}
                  </el-tag>
                  <!-- 动态切换按钮或表单 -->
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)" style="width: 130px;">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" width="50">
              </el-table-column>
              <el-table-column label="参数名称" prop="attr_name">
              </el-table-column>
              <el-table-column label="操作" prop="attr_write">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑
                  </el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>

    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addParamsDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数的对话框 -->
    <el-dialog :title="'编辑' + titleText" :visible.sync="editParamsDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script scoped>
  export default {
    name: 'Parames',
    data() {
      return {
        activeName: 'many',
        // 商品分类列表
        paramslist: [],
        // 级联选择器的属性
        paramsProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger: 'hover'
        },
        // 级联选择器双向绑定到的数组
        selectCateKeys: [],
        // 动态参数的数据
        manyTabList: [],
        // 静态属性的数据
        onlyTabList: [],
        // 控制添加对话框的显示与隐藏
        addParamsDialogVisible: false,
        // 添加参数的数据对象
        addForm: {
          attr_name: '',
        },
        // 添加表单的验证规则对象
        addFormRules: {
          attr_name: [
            {
              required: true, message: '请输入参数名称', trigger: 'blur'
            }
          ]
        },
        // 控制编辑参数的显示与隐藏
        editParamsDialogVisible: false,
        // 编辑参数的数据对象
        editForm: {
          attr_name: '',
        },
        // 编辑表单的验证规则对象
        editFormRules: {
          attr_name: [
            {
              required: true, message: '请输入参数名称', trigger: 'blur'
            }
          ]
        },
      }
    },
    created() {
      this.getParamsList()
    },
    methods: {
      // 获取所有的商品分类列表
      async getParamsList() {
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.paramslist = res.data
        console.log(this.paramslist);
      },
      // 级联选择框选中项变化，会触发这个函数
      handleChange() {
        this.getParamsData()
      },
      handleTabClick() {
        // 点击动态获取面板名称
        console.log(this.activeName);
        this.getParamsData()
      },
      // 获取参数的列表数据
      async getParamsData() {
        // 如果选择的不是三级分类
        if (this.selectCateKeys.length !== 3) {
          this.selectCateKeys = [];
          this.manyTabList = [];
          this.onlyTabList = [];
          return
        }
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

        // 遍历数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制文本框的显示与隐藏
          item.inputVisible = false,
            item.inputValue = ''
        })
        // 根据获取到的数据的 attr_sel 判断是否是 many 或 only来获取不同的数据
        if (this.activeName === 'many') {
          this.manyTabList = res.data;
          console.log(this.manyTabList);
        } else {
          this.onlyTabList = res.data;
          console.log(this.onlyTabList);
        }
      },
      // 添加参数
      addParams() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          })
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success('添加参数成功!')
          this.addParamsDialogVisible = false;
          this.getParamsData()
        })
      },
      // 监听添加参数的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      // 查询当前参数信息
      async showEditDialog(attr_id) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, { params: { attr_sel: this.activeName } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editForm = res.data;
        this.editParamsDialogVisible = true;
      },
      // 编辑动态参数
      editParams() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          })
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('编辑参数成功!')
          this.getParamsData()
          this.editParamsDialogVisible = false;
        })
      },
      // 监听编辑参数的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      // 删除参数
      async removeParams(attr_id) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该参数，是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
        // 用户取消了删除
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('删除参数成功!')
        this.getParamsData()
      },
      // 文本框失去焦点或按下了enter键
      async handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
          row.inputValue = '',
            row.inputVisible = false
          return
        }
        // 如果不为空，说明用户输入了数据
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        // 发起请求，保存数据
        this.saveAttrVals(row)
      },

      async saveAttrVals(row) {
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改参数成功！')
      },
      // 点击按钮展示文本输入框
      showInput(row) {
        row.inputVisible = true;
        // 让文本框自动获取焦点
        // $nextTick 方法的作用，当页面上元素被重新渲染之后，才会执行回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      // 点击删除标签
      handleClose(index, row) {
        row.attr_vals.splice(index, 1)
        this.saveAttrVals(row)
      }
    },
    computed: {
      // 如果等级不是为三级，禁用按钮，
      idBtnDisabled() {
        if (this.selectCateKeys.length !== 3) {
          return true
        } else {
          return false
        }
      },
      // 当前选中的三级分类的id
      cateId() {
        if (this.selectCateKeys.length === 3) {
          return this.selectCateKeys[2]
        }
        return null
      },
      // 动态计算属性的文本
      titleText() {
        if (this.activeName === 'many') {
          return '动态参数'
        }
        return '静态属性'
      }
    }
  }
</script>
<style>
  .classify .el-cascader {
    margin: 15px 0;
  }

  .el-tag {
    margin: 0 7px;
  }
  .el-form-item__content{
    margin-right: 15px;
  }
</style>