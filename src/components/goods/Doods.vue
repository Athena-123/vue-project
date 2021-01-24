<template>
  <div>
    <!-- 面包屑导航 -->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <!-- clearable 清除按钮 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getDoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getDoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>


      <!-- 表格区 -->
      <template>
        <el-table border style="width: 100%" stripe :data="goodslist">
          <el-table-column type="index" label="序号" width="40px">
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名称">
          </el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)" width="60px">
          </el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="60px">
          </el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="160px">
            <template slot-scope="scope">
              {{scope.row.add_time | msgFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="110px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="small"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="removeGoods(scope.row.goods_id)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 分页区 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script scoped>
  export default {
    name: 'Doods',
    data() {
      return {
        goodslist: [],
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10,
        },
        total: 0,
      }
    },
    created() {
      this.getDoodsList()
    },
    methods: {
      async getDoodsList() {
        const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        console.log(res);
        this.goodslist = res.data.goods;
        this.total = res.data.total;
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getDoodsList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getDoodsList()
      },
      async removeGoods(id) {
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
        const { data: res } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('删除参数成功!')
        this.getDoodsList()
      },
      addGoods(){
        this.$router.push('/goods/add')
      }
    },
  };
</script>
<style>
  .el-row .el-button {
    margin: 0 15px;
  }
</style>