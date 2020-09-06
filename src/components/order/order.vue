<template>
        <div>
        <!-- 面包屑导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>订单列表</el-breadcrumb-item>
            </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <!-- gutter是每个col之间的间隔 -->
            <el-row :gutter="25">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getOrdersList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" >添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 订单表格区域 -->
            <el-table :data="ordersList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index" label="序号" width="80px"></el-table-column>
                <!-- 第一列 -->
                <el-table-column label="订单编号" prop="order_number" ></el-table-column>
                <!-- 第二列 -->
                <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
                <!-- 第三列 -->
                <el-table-column label="是否付款" width="140px">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
                        <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
                    </template>
                </el-table-column>
                <!-- 第四列 -->
                <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
                <!-- 第五列 -->
                <el-table-column label="下单时间" prop="create_time" width="250px">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <!-- 第六列 -->
                <el-table-column label="操作" width="160px">
                    <template slot-scope="">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
                        <!-- 设置按钮 -->
                        <el-button type="success" icon="el-icon-setting" size="mini" 
                        ></el-button>
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
            // 请求参数
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            // 订单数据绑定
            ordersList: [],
            // 总数据
            total: 0,

        }
    },
    created() {
        this.getOrdersList()
    },
    methods: {
        async getOrdersList () {
            const { data : res} = await this.$http.get(`orders`, {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) return this.$message.error('订单列表数据获取失败！')
            this.ordersList = res.data.goods
            console.log(this.ordersList);
            // console.log(res.data);
            this.total = res.data.total
            // console.log(this.total);
            // console.log(this.queryInfo);
        },
        // 监听每页显示数量的改变  当前点击的页码中的数据数量newSize
        handleSizeChange (newSize) {
            // console.log(newSize)
            this.queryInfo.pagesize = newSize
            // 通过改变 发送请求用户列表的参数 中的 pagesize 来重新获取用户列表
            this.getOrdersList()
        },
        // 监听 页码值 的改变   newPage当前点击的页码值
        handleCurrentChange (newPage) {
            // console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getOrdersList()
        },
    },
}
</script>

<style>

</style>