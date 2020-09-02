<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡牌内容区域 -->
        <el-card class="box-card">
            <!-- gutter是每个col之间的间隔 -->
            <el-row :gutter="25">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 商品表格区域 -->
            <el-table :data="goodsList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index" label="序号" width="80px"></el-table-column>
                <!-- 第一列 -->
                <el-table-column label="商品名称" prop="goods_name" ></el-table-column>
                <!-- 第二列 -->
                <el-table-column label="商品价格(元)" prop="goods_price" width="120px"></el-table-column>
                <!-- 第三列 -->
                <el-table-column label="商品重量" prop="goods_weight" width="120px"></el-table-column>
                <!-- 第四列 -->
                <el-table-column label="创建时间" prop="add_time" width="180px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <!-- 第五列 -->
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" 
                        @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页管理 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5,10,12]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // 查询参数对象
            queryInfo : {
                // 搜索的关键字
                query: '',
                // 当前显示的页码值
                pagenum : 1,
                // 每页条数
                pagesize : 10
            },
            // 绑定 商品列表数据
            goodsList: [],
            // 绑定 总的数据条数
            total: 0,

        }
    },
    methods: {
        // 获取商品列表数据
        async getGoodsList () {
            const { data : res} = await this.$http.get(`/goods`, {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) return this.$message.error('商品列表数据获取失败！')
            console.log(res.data);
            this.goodsList = res.data.goods
            this.total = res.data.total
            // console.log(this.goodsList)
            // console.log(this.total)
        },
        // 监听每页显示数量的改变  当前点击的页码中的数据数量newSize
        handleSizeChange (newSize) {
            // console.log(newSize)
            this.queryInfo.pagesize = newSize
            // 通过改变 发送请求用户列表的参数 中的 pagesize 来重新获取用户列表
            this.getGoodsList()
        },
        // 监听 页码值 的改变   newPage当前点击的页码值
        handleCurrentChange (newPage) {
            // console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        // 根据id删除按钮
        async removeById (id) {
            // 弹框询问确认删除  confirmResult布尔值
            const confirmResult = await this.$confirm('此操作将永久删除该标签权限, 是否继续?', 
            '提示', 
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => {return err})
            if (confirmResult !== 'confirm') return this.$message.info('成功取消删除操作！')
            const { data: res } = await this.$http.delete(`goods/${id}`)
            if (res.meta.status !== 200) return this.$message.error('该标签删除失败！')
            this.$message.success('该标签删除成功！')
            this.getGoodsList()
        },
        // 添加商品
        goAddPage () {
            this.$router.push('/goods/add')
        }
    },
    created() {
        this.getGoodsList()
        console.log(this.goodsList);
    },
}
</script>

<style lang="less" scope>

</style>