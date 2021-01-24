<template>
  <div>
    <!-- 商品页面包屑导航 -->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div ref="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script scoped>
  var echarts = require('echarts');
  import _ from 'lodash'
  export default {
    name: 'Reports',
    data() {
      return {
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    created() {

    },
    async mounted() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.main);

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      };

      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg)
      }

      // 合并数据
      const result = _.merge(res.data, this.options)

      // 5.展示数据，使用刚指定的配置项和数据显示图表。
      myChart.setOption(result);
    },
    methods: {

    },
  };
</script>
<style>
</style>