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

    <!-- 权限管理 -->
    <el-card>
      <el-table :data="rightslist" border stripe>
        <el-table-column type="index" label="索引"> </el-table-column>
        <el-table-column type="authName" label="权限名称" prop="authName"> </el-table-column>
        <el-table-column type="path" label="权限路径" prop="path"> </el-table-column>
        <el-table-column type="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level ==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script scoped>
  export default {
    data() {
      return {
        rightslist: []
      }
    },
    created() {
      this.getRightsList()
    },
    methods: {
      async getRightsList() {
        const { data: res } = await this.$http.get('rights/list')
        console.log(res);
        if (res.meta.status != 200) {
          return this.$message(res.meta.msg)
        }
        this.rightslist = res.data
      }
    }
  };
</script>
<style>
</style>