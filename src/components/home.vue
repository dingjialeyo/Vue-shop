<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/dog.png" alt="">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出登录</el-button></el-header>
        <!-- 页面主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isZhedie ? '64px' : '200px'">
                <!-- 侧边栏菜单区域 -->
                <div class="toggle-btn" @click="zhedie">
                    |||
                </div>
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409Eff" :unique-opened="true" :collapse="isZhedie" :collapse-transition="false" router :default-active="activePath">
                    <!-- 一级菜单区域 -->
                    <el-submenu :key="item.id" :index="item.id + ''" v-for="item in menulist">
                        <!-- 一级菜单内容 -->
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单区域 -->
                        <el-menu-item :index="'/' + son.path" v-for="son in item.children" :key="son.id" @click="gaoliang('/' + son.path)">
                            <!-- 二级菜单内容 -->
                            <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{ son.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右边主体区 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
    
</template>

<script>
export default {
    // 数据存放
    data() {
        return {
            // 菜单数据
            menulist : [],
            // 一级菜单图标渲染
            iconsObj : {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            // 折叠判断
            isZhedie : false,
            // 二级菜单高亮的地址
            activePath: ''
        }
    },
    // 生命周期函数
    created() {
        this.getMenuList()
        this.activePath =  window.sessionStorage.getItem('activePath')
    },
    methods: {
        logout() {
            // 清空token
            window.sessionStorage.clear()
            // 跳转页面
            this.$router.push('/login')
        },
        // 获取菜单    {data: res} 将获取来的data属性命名为res 
        async getMenuList() {
            const {data: res} = await this.$http.get('/menus')
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menulist = res.data
        },
        // 折叠菜单栏
        zhedie() {
            this.isZhedie = !this.isZhedie
        },
        // 二级菜单高亮
        gaoliang(activepath) {
            window.sessionStorage.setItem('activePath', activepath)
            this.activePath = activepath
        }
    },
}
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }
    .el-header {
        padding-left: 0;
        background-color: #373d41;
        display: flex;
        // 两边对齐
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 20px;
        div {
            display: flex;
            align-items: center;
            margin-left: 15px;
        }
    }
    
    .el-aside {
        background-color: #333744;
        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #EAEDF1;
    }

    .iconfont {
        margin-right: 10px;
    }

    .toggle-btn {
        color: #fff;
        background-color: #4A5064;
        line-height: 24px;
        text-align: center;
        font-size: 10px;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>

