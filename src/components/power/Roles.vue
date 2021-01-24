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

    <!-- <el-card> -->
    <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>

    <el-table :data="roleslist" border stripe>
      <!-- 下拉分配权限选择 -->

      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级权限 -->
          <el-row :class="['bdbottom',index===0 ? 'bdtop': '']" v-for='(item,index) in scope.row.children' :key="
              item.id">
            <el-col :span="5">
              <el-tag closable @close="removeRight(scope.row,item.id)">{{item.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <!-- 二级权限 -->
              <el-row v-for="(item2,index2) in item.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag type="success" closable @close="removeRight(scope.row,item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="18">
                  <el-tag v-for="(item3,index3) in item2.children" :key="item3.id" type="warning" closable
                    @close="removeRight(scope.row,item3.id)">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"> </el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" @click="modification(scope.row.roleName,scope.row.id)">修改
          </el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" @click="open(scope.row.id)">删除</el-button>
          <!-- 分配角色按钮 -->
          <el-button type="warning" icon="el-icon-setting" @click="setRolesDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- </el-card> -->


    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="closeDialog">
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all
        :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script scoped>
  export default {
    data() {
      return {
        roleslist: [],
        // 所有权限的数据
        rightslist: [],
        // 控制分配权限对话的显示与隐藏
        setRightDialogVisible: false,
        // 树形控件绑定的对象
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        // 编辑角色
        editDialogVisible: false,
        // 默认选中的节点ID值数组
        defKeys: [],
        roleId:'',

      }
    },
    created() {
      console.log(11);
      this.getRolesList()
    },
    methods: {
      // 获取页面数据
      async getRolesList() {
        const { data: res } = await this.$http.get('roles/')
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.roleslist = res.data
      },
      // 删除权限
      async removeRight(role, id) {
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
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg)
        }
        // this.getUserList()
        // this.roleslist = res.data
        role.children = res.data
      },

      //展示设置分配权限的对话框
      async setRolesDialog(role) {
        this.roleId  = role.id
        console.log(role);
        const { data: res } = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.rightslist = res.data;
        this.getLeafKeys(role, this.defKeys)
        this.setRightDialogVisible = true;
      },


      getLeafKeys(node, arr) {
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })
      },

      // Dialog 关闭的回调
      closeDialog() {
        this.defKeys = []
      },

      // 为角色添加权限
      async allotRights(){
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
        const {data:res}  = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        if(res.meta.status!==200) return this.$message.error(res.meta.msg)
        this.getRolesList()
        this.setRightDialogVisible = false;
      },

      // 删除角色
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
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('删除用户成功！')
        this.getRolesList()
      },
    }
  }
</script>
<style scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #ccc;
  }
</style>