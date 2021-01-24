<template>
  <div>
    <!-- 商品页面包屑导航 -->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 商品卡片区 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <!-- clearable 清除按钮 -->
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>


      <!-- 表格区 -->
      <el-table :data="orderlist" stripe border>
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | msgFormat}}
          </template>
        </el-table-column>
        <el-table-column prop="pay_status" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editAddress"></el-button>
            <el-button type="success" icon="el-icon-location" @click="progress"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 5, 10, 15]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

      <!-- 修改地址对话框 -->
      <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="addressDialogClosed">
        <el-form :model="addressForm" :rules="addressRules" ref="ruleFormRef" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 物流对话框 -->
      <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
        <el-timeline :reverse="reverse">
          <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>

    </el-card>
  </div>
</template>

<script scoped>
  import cityData from './citydata.js'
  export default {
    name: 'Order',
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10,
        },
        orderlist: [],
        total: 0,
        // 控制修改地址对话框的显示与隐藏
        editDialogVisible: false,
        addressForm: {
          address1: [],
          address2: '',
        },
        addressRules: {
          address1: [
            {
              required: true, message: '请选择省市区/县', trigger: 'blur'
            }
          ],
          address2: [
            {
              required: true, message: '请输入正确的详细地址', trigger: 'blur'
            }
          ]
        },
        cityData,
        progressDialogVisible: false,
        progressInfo: [],
        reverse: true,
      }
    },
    created() {
      this.getOrdersList()
    },
    methods: {
      async getOrdersList() {
        const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.total = res.data.total;
        this.orderlist = res.data.goods
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
      },
      // 修改地址
      editAddress() {
        this.editDialogVisible = true;
      },
      // 监听对话框关闭事件
      addressDialogClosed() {
        // 清空表单数据
        this.$refs.ruleFormRef.resetFields()
      },
      async progress() {
        // const { data: res } = await this.$http.get('/kuaidi/1106975712662')
        // console.log(res);
        // if (res.meta.status !== 200) {
        //   return this.$message.error(res.meta.msg)
        // }
        // this.progressInfo = res.data
        this.progressDialogVisible = true
      }
    },
  };
</script>
<style>
</style>