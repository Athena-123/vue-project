<template>
  <el-container class="home-container">
    <!-- 导航栏区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商管理后台系统</span>
      </div>
      <el-button type="info" @click="out">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏部分 -->
      <el-aside :width="isCollpase ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单部分 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409fff" :collapse="isCollpase"
          :collapse-transition="false" router :default-active="active">
          <el-submenu :index="item.id + ''" v-for="(item,index) in menulist" :key="item.id">
            <!-- 一级标题 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级标题 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
              @click="activePath('/'+subItem.path)">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script scoped>
  export default {
    name: 'Home',
    data() {
      return {
        menulist: [],
        iconsObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao',
        },
        isCollpase: false,
        active: '',
      }
    },
    created() {
      this.getMenuList(),
        this.active = window.sessionStorage.getItem('activePath')
    },
    methods: {
      out() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      async getMenuList() {
        const { data: res } = await this.$http.get('menus')
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menulist = res.data
      },
      toggleCollapse() {
        return this.isCollpase = !this.isCollpase;
      },
      activePath(active) {
        window.sessionStorage.setItem('activePath', active)
      }
    },


  };
</script>
<style scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    display: flex;
    background-color: #373d41;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
  }

  .el-header div {
    display: flex;
    align-items: center;
    color: #fff;
  }

  .el-header div img {
    padding: 10px;
  }

  .el-aside {
    background-color: #333744;
  }

  .el-menu {
    border-right: 0;
  }

  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    padding-right: 10px;
  }

  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
  }
</style>