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
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="20">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
            @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 数据列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column label="姓名" prop="username">
        </el-table-column>
        <el-table-column label="邮箱" prop="email">
        </el-table-column>
        <el-table-column label="电话" prop="mobile">
        </el-table-column>
        <el-table-column label="角色" prop="role_name">
        </el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <!-- 当前行的数据信息 -->
            <!-- {{scope.row}} -->

            <el-switch v-model="scope.row.mg_state" @change="user_state(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="ma_state">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" @click="modification(scope.row.id)"></el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" @click="open(scope.row.id)"></el-button>
            </el-tooltip>

            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" status-icon @close="addClosed">
      <!-- 内容主体区 -->
      <el-form :rules="addFormRules" label-width="70px" :model="addForm" ref="addFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" status-icon @close="editClosed">
      <!-- 内容主体区 -->
      <el-form :rules="editFormRules" label-width="70px" :model="editForm" ref="editFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="RoleDialogVisible" width="30%" @close="RoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>



    <!-- 删除按钮 -->

  </div>
</template>

<script scoped>
  export default {
    name: 'User',
    data() {
      // 验证邮箱的规则
      var emailRule = (rule, value, callback) => {
        const regEmail = /^\w+@\w+(\.\w+)+$/;
        if (regEmail.test(value)) {
          // 合法的邮箱
          return callback()
        }
        callback(new Error('请输入合法的邮箱'))
      };
      // 验证手机号的规则
      var mobileRule = (rule, value, callback) => {
        const regMobile = /^1[34578]\d{9}$/
        if (regMobile.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的手机号'))
      };
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 3
        },
        userList: [],
        total: 0,
        // 控制添加用户对话框的显示与隐藏
        dialogVisible: false,

        // 控制修改用户对话框的显示与隐藏
        editDialogVisible: false,

        // 添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
        // 修改用户信息的表单数据
        editForm: {
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
        // 添加用户表单验证规则
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: emailRule, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: mobileRule, trigger: 'blur' }
          ],
        },

        // 修改用户表单验证
        editFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: emailRule, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: mobileRule, trigger: 'blur' }
          ],
        },

        // 删除用户数据
        async open(id) {
          const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)
          // 如果用户确认删除，则返回值为字符串， confirm
          // 如果用户取消了删除，则返回值为字符串， cancel
          if (confirmRes != 'confirm') {
            return this.$message.info('已取消删除')
          }
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status != 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('删除用户成功！')
          this.getUserList()
        },
        // 控制分配角色对话框的显示与隐藏
        RoleDialogVisible: false,
        // 需要被分配角色的用户信息
        userInfo: {},
        // 展示所有的角色的数据列表
        rolesList: '',
        // 已选中的角色id值
        selectedRoleId: '',
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      // 发送请求
      async getUserList() {
        const { data: res } = await this.$http.get('users', { params: this.queryInfo })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // console.log(res);
        // 当当前页面一条数据都没有时，自动跳到前一页
        if (res.data.users.length == 0 && this.queryInfo.pagenum > 1) {
          this.queryInfo.pagenum--;
          this.getUserList()
        }
        this.userList = res.data.users
        this.total = res.data.total
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // newSize 根据 page-sizes 自动获取页面的条数 
        this.queryInfo.pagesize = newSize;
        // 将每页展示的条数修改后提交给服务器，渲染页面
        this.getUserList()
      },
      // 监听 pagenum 页码值改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getUserList()
      },
      // 点击状态按钮习惯用户状态
      async user_state(state) {
        console.log(state);
        const { data: res } = await this.$http.put(`users/${state.id}/state/${state.mg_state}`)
        if (res.meta.status !== 200) {
          state.mg_state = !state.mg_state
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('更新用户状态成功！')
      },

      // 监听添加用户对话框的关闭事件
      addClosed() {
        this.$refs.addFormRef.resetFields()
      },

      // 点击按钮，添加新用户
      submitForm() {
        // validator 验证
        console.log(this.$refs.addFormRef);
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          // 否则，发起添加用户的网络请求
          else {
            const { data: res } = await this.$http.post('users', this.addForm)
            console.log(res);
            if (res.meta.status !== 201) return this.$message.error(res.meta.msg)

            this.$message.success('更新用户状态成功！')
            // 隐藏添加用户的对话框
            this.dialogVisible = false,
              // 重新获取用户列表数据
              this.getUserList()
          }
        })
      },

      // 监听修改用户对话框的关闭事件
      editClosed() {
        this.$refs.editFormRef.resetFields()
      },


      // 点击修改按钮修改数据
      async modification(id) {
        this.editDialogVisible = true;
        const { data: res } = await this.$http.get('users/' + id)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 将得到的数据添加到修改的表单中
        this.editForm = res.data
      },
      // 点击确定按钮修改用户信息
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          // 发起修改用户信息的数据请求
          const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          // 关闭对话框
          this.editDialogVisible = false;
          // 重新获取用户列表数据
          this.getUserList()
          // 将得到的数据添加到修改的表单中
          this.$message.success('修改用户信息成功!')
        })
      },

      // 展示分配角色的对话框
      async setRole(userInfo) {
        this.userInfo = userInfo
        // 在展示对话框之前，获取所有的角色列表
        const { data: res } = await this.$http.get('roles')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rolesList = res.data
        this.RoleDialogVisible = true
      },

      // 点击按钮，分配角色
      async saveRoleInfo() {
        if (!this.selectedRoleId) {
          return this.$message.error('请选择要分配的角色')
        }

        const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success('更新角色成功')
        this.getUserList()
        this.RoleDialogVisible = false
      },
      RoleDialogClosed(){
        this.selectedRoleId = ''
        this.userInfo = {}
      }

    },
  };
</script>
<style>
  .el-breadcrumb {
    margin-bottom: 10px;
    font-size: 12px;
  }

  .el-table {
    margin-top: 15px;
    font-size: 12px;
  }

  .el-pagination {
    margin-top: 20px;
  }

  .cell .el-button {
    padding: 5px 12px;
    font-size: 12px;
  }
</style>