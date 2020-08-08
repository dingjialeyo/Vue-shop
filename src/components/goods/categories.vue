<template>
  <div>
      <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡牌视图区域 -->
        <el-card class="box-card">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addCateDialog">添加分类</el-button>
                </el-col>
                <!-- 表格区域 -->
                <tree-table :data="cateList" border stripe :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#">
                    <!-- 第二列模板 -->
                    <template slot="isOk" slot-scope="scope">
                        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: green;"></i>
                        <i class="el-icon-error" v-else style="color: red;"></i>
                    </template>
                    <!-- 第三列模板 -->
                    <template slot="Grade" slot-scope="scope">
                        <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                        <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
                        <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
                    </template>
                    <!-- 第四列模板 -->
                    <template slot="setting" slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="cateDel(scope.row.cat_id)">删除</el-button>
                    </template>
                </tree-table>
                <!-- 分页区域 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1,3,5,10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </el-row>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="cateDialogVisible" width="50%" @close="addCateClose">
            <!-- 内容区域 -->
            <el-form :model="addCate" :rules="addCateRules" ref="addCateRef" >
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCate.cat_name"></el-input>
                </el-form-item>
                <el-form-item label='父级分类:' >
                    <!-- 级联选择器  options用来指定数据源  props用来指定配置对象-->
                    <el-cascader
                    expand-trigger="hover"
                    v-model="selectData"
                    :options="parentCateList"
                    :props="cateProps"
                    @change="parentCateChange" clearable>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="cateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="ifCateDialog">确 定</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script>
export default {
    data () {
        return {
            // 商品分类的 查询条件
            queryInfo: {
                // 第三层分类的商品
                type: 3,
                // 第一页
                pagenum: 1,
                // 初始每页显示5条数据
                pagesize: 5
            },
            // 对应的多少条数据
            total: 0,
            // 对应的 商品分类列表数据
            cateList: [],
            //为table指定列属性
            columns: [
            {
                // 第一列
                label: '分类名称',
                // 对应的数据名称
                prop: 'cat_name',
            },
            {
                // 第二列
                label: '是否有效',
                // 表示 当前列 为模板列
                type: 'template',
                // 该模板的名称
                template: 'isOk',
            },
            {
                // 第三列
                label: '排序',
                type: 'template',
                template: 'Grade'
            },
            {
                // 第四列
                label: '操作',
                type: 'template',
                template: 'setting'
            }],
            // 添加分类对话框的显示和隐藏
            cateDialogVisible: false,
            // 添加对应的分类数据
            addCate: {
                cat_name: '',
                cat_pid: 0,
                cat_level: 0
            },
            // 以及对应的验证规则
            addCateRules: {
                cat_name: [
                    {
                        required: true,
                        message: '请填写分类名称',
                        trigger: 'blur'
                    }
                ]
            },
            // 父级分类对应的数据
            parentCateList: [
            ],
            // 用来指定级联选择器的配置对象
            cateProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 父级级联选择器  选中后的 结果数据
            selectData: []
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList () {
            const { data: res } = await this.$http.get('categories',{
                params: this.queryInfo
            })
            if (res.meta.status !== 200) return this.$message.error('商品分类的数据获取失败！')
            // 对应的商品分类数据
            this.cateList = res.data.result
            // 对应的 商品条数
            this.total = res.data.total
        },
        // 监听pagesize改变的事件
        handleSizeChange (newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听 页码值 的改变   newPage当前点击的页码值
        handleCurrentChange (newPage) {
            // console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        // 打开添加分类对话框
        addCateDialog () {
            this.cateDialogVisible = true
            this.getParentCateList()
        },
        // 获取父级的分类数据
        async getParentCateList () {
            const { data: res} = await this.$http.get('categories', {
                params: {
                    type: 2,
                }
            })
            if (res.meta.status !== 200) return this.$message.error('父级分类数据获取失败！')
            // console.log(res.data);
            this.parentCateList = res.data
        },
        // 级联选择器的选中 发生变化 触发
        parentCateChange () {
            // console.log(this.selectData);
            // 如果this.selectData的id不等于0说明选择了父级分类，反之

            // 选择了父级级联选择器的情况
            if(this.selectData.length > 0) {
                this.addCate.cat_pid = this.selectData[this.selectData.length-1]
                this.addCate.cat_level = this.selectData.length
                // console.log(this.addCate);
                return
            }
            // 没有选择父级
            else {
                this.addCate.cat_pid = 0
                this.addCate.cat_level = 0
            }   
        },
        // 关闭对话框  重置数据
        addCateClose () {
            this.$refs.addCateRef.resetFields()
            this.selectData = []
            this.addCate.cat_pid = 0
            this.addCate.cat_level = 0
        },
        // 确定添加分类按钮
        ifCateDialog () {
            this.$refs.addCateRef.validate(async valid => {
                if (!valid) return
                const {data: res } = await this.$http.post('categories',this.addCate)
                if (res.meta.status !== 201) return this.$message.error('添加商品分类数据失败！')
                this.getCateList()
                this.cateDialogVisible = false
                this.$message.success('添加商品分类数据成功！')
            })

        },
        // 删除对应的分类
        async cateDel (id) {
            // 弹框询问确认删除  confirmResult布尔值
            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', 
            '提示', 
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .catch(err => {return err})
            // console.log(confirmResult);
            // 如果用户取消删除  返回字符串为 --cancel
            // 如果用户确定删除  返回字符串为 --confirm
            if (confirmResult !== 'confirm') return this.$message.info('成功取消删除操作！')
            const { data: res} = await this.$http.delete(`categories/${id}`)
            if (res.meta.status !== 200) return this.$message.error('用户删除操作失败！')
            this.$message.success('用户删除操作成功！')
            this.getCateList()
        }
    },
}
</script>

<style lang="less" scoped>
    .el-col {
        margin-bottom: 20px;
    }
    .el-cascader {
        width: 100%;
    }
</style>
