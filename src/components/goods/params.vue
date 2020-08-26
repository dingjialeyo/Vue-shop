<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡牌内容区域 -->
        <el-card class="box-card">
            <!-- 警告区域 -->
            <el-alert
            title="注意：只允许为第三级分类设置相关参数"
            type="warning" show-icon>
            </el-alert>
            <!-- 选择商品内容区域 -->
            <el-row class="select_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <!--options属性绑定的对应的数据展示
                        v-model属性是你选定后的结果值
                        props属性是指这个级联选择器的配置对象-->
                    <el-cascader
                    expand-trigger="hover"
                    v-model="selectData"
                    :options="cateList"
                    :props="cateProps"
                    @change="handleChange"
                    clearable>
                    </el-cascader>
                </el-col>
            </el-row>
            <!-- tab 页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addManyAttrDialog">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTabsData" border stripe>
                        <!-- 展开列 -->
                        <el-table-column type="expand" width="60px" label="#">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" type="primary" closable @close="handleClose(index, scope.row)" >{{item}}</el-tag> 
                                <!-- 添加新标签 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="序号" width="60px"></el-table-column>
                        <!-- 第一列 -->
                        <el-table-column label="参数名称" prop="attr_name" ></el-table-column>
                        <!-- 第二列 -->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="putParams(scope.row.attr_id)">编辑</el-button><el-button type="danger" size="mini" icon="el-icon-delete" @click="delParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态参数的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addOnlyAttrDialog">添加参数</el-button>
                    <!-- 静态参数表格 -->
                    <el-table :data="onlyTabsData" border stripe>
                        <!-- 展开列 -->
                        <el-table-column type="expand" width="60px" label="#">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" type="primary" closable @close="handleClose(index, scope.row)" >{{item}}</el-tag> 
                                <!-- 添加新标签 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="序号" width="60px"></el-table-column>
                        <!-- 第一列 -->
                        <el-table-column label="属性名称" prop="attr_name" ></el-table-column>
                        <!-- 第二列 -->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="putParams(scope.row.attr_id)">编辑</el-button><el-button type="danger" size="mini" icon="el-icon-delete" @click="delParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加 静态\动态 属性对话框 -->
        <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addAttrDialogVisible"
        width="30%"
        @close="addAttrClose">
        <!-- 内容区域 -->
        <!-- 
            addAttr 是你填写后的 表单数据对象
            addAttrRules 表单的验证规则
            addRolesRef 用于重置，和判断填写是否正确

        -->
        <el-form :model="addAttr" :rules="addAttrRules" ref="addAttrRef" label-width="90px" >
            <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addAttr.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addAttrDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改静态\动态属性对话框 -->
        <el-dialog
        :title="'修改' + titleText"
        :visible.sync="putAttrDialogVisible"
        width="30%"
        @close="putAttrClose">
        <!-- 内容区域 -->
        <!-- 
            addAttr 是你填写后的 表单数据对象
            addAttrRules 表单的验证规则
            addRolesRef 用于重置，和判断填写是否正确

        -->
        <el-form :model="putAttr" :rules="putAttrRules" ref="putAttrRef" label-width="90px" >
            <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="putAttr.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="putAttrDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="okPutParams">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data () {
        return {
            // 级联选择器-商品列表数据
            cateList: [],
            // 级联选择器-选中后的结果
            selectData: [],
            // 级联选择器-配置对象
            cateProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // tabs栏 默认激活
            activeName: 'many',
            // 动态参数数据绑定
            manyTabsData: [],
            // 静态参数数据绑定
            onlyTabsData: [],
            // 静态属性对话框的显示隐藏
            addAttrDialogVisible: false,
            // 添加参数的表单数据对象
            addAttr: {
                attr_name: ''
            },
            // 添加属性表单的验证规则
            addAttrRules: {
                attr_name: [
                    {
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur'
                    }
                ]
            },
            // 修改参数表单数据对象
            putAttr: {},
            // 修改属性表单的验证规则
            putAttrRules: {
                attr_name: [
                    {
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur'
                    }
                ]
            },
            // 修改属性对话框的显示隐藏
            putAttrDialogVisible: false,
            
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取商品列表数据
        async getCateList () {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('商品分类的数据获取失败！')
            // 对应的商品分类数据
            this.cateList = res.data
            // console.log(this.cateList);
        },
        // 级联选择器发生变化
        handleChange () {
            // 获取参数列表数据
            this.getParamsData()
        },
        // Tab 点击事件
        handleTabsClick () {
            // 获取参数列表数据
            this.getParamsData()
        },
        // 获取参数列表数据
        async getParamsData () {
            // 选中的结果数组长度不为3 说明没有 选到 三级分类
            if (this.selectData.length !== 3) {
                this.selectData = []
                this.manyTabsData = [],
                this.onlyTabsData = []
                return
            }
            // 选中三级分类的操作 根据分类的id，和当前所处的面板name，获取对应的参数
            // console.log(this.selectData);
            const { data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                params: {sel: this.activeName}
            })
            if (res.meta.status !== 200) return this.$message.error('参数获取失败！')
            console.log(res.data);
            // 将res.data中的attr_vals用空格隔开循环成一个数组再返回给res.data
            res.data.forEach(item => {
                // 判断attr_vals的值是否为空 为空 返回一个空数组
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                // 控制添加标签文本框的显示和隐藏
                item.inputVisible = false
                item.inputValue = ''
            })
            console.log(res.data);
            // 将动态数据和静态数据分开
            if (this.activeName === 'many') {
                this.manyTabsData = res.data
            }
            else {
                this.onlyTabsData = res.data
            }
        },
        // 打开添加静态属性对话框的操作
        addOnlyAttrDialog () {
            this.addAttrDialogVisible = true
        },
        // 打开添加属性动态对话框的操作
        addManyAttrDialog () {
            this.addAttrDialogVisible = true
        },
        // 关闭添加属性对话框操作
        addAttrClose () {
            this.$refs.addAttrRef.resetFields()
        },
        // 点击按钮 添加参数
        addParams () {
            this.$refs.addAttrRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    attr_name: this.addAttr.attr_name,
                    attr_sel: this.activeName,
                })
                if (res.meta.status !== 201) return this.$message.error('添加' + this.titleText + '失败！')
                this.getParamsData()
                this.addAttrDialogVisible = false
                this.$message.success('添加'+ this.titleText +'成功！')
            })
        },
        // 点击编辑 获取该当前参数的信息
        async putParams (attrId) {
            const { data : res} = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
                params: {
                    attr_sel: this.activeName,
                }
            })
            if (res.meta.status !== 200) return this.$message.error('获取该属性失败！')
            // console.log(res.data);
            // 将获取到的参数信息给到表单中的数据对象
            this.putAttr = res.data
            // console.log(this.putAttr);
            this.putAttrDialogVisible = true
        },
        // 关闭修改属性对话框操作
        putAttrClose () {
            this.$refs.putAttrRef.resetFields()
        },
        // 编辑按钮 提交 
        okPutParams () {
            this.$refs.putAttrRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.putAttr.attr_id}`, {
                    attr_name: this.putAttr.attr_name,
                    attr_sel: this.activeName,
                })
                if (res.meta.status !== 200) return this.$message.error('修改' + this.titleText + '失败！')
                this.getParamsData()
                this.putAttrDialogVisible = false
                this.$message.success('修改'+ this.titleText +'成功！')
            })
        },
        async delParams (id) {
            // 弹框询问确认删除  confirmResult布尔值
            const confirmResult = await this.$confirm('此操作将永久删除该标签权限, 是否继续?', 
            '提示', 
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => {return err})
            if (confirmResult !== 'confirm') return this.$message.info('成功取消删除操作！')
            const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
            if (res.meta.status !== 200) return this.$message.error('该标签删除失败！')
            this.$message.success('该标签删除成功！')
            this.getParamsData()
        },
        // 添加标签的 文本框 失去焦点 或 摁下 Enter键 都会触发
        handleInputConfirm (row) {
            // 用户输入空格时的处理
            if(row.inputValue.trim().length === 0) {
                row.inputVisible = ''
                row.inputVisible = false
                return
            }
            // 用户输入合法的数值的处理
            // console.log(row.inputValue);
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = '',
            row.inputVisible = false
            // 我要要将重新获取的row.attr_vals上传到数据库中
            // console.log(row.attr_vals);
            // 重新获取 标签 数据
            this.saveAttrVals(row)
        },
        // 添加/删除-标签重新获取标签数据
        async saveAttrVals (row) {
            const { data : res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_name : row.attr_name,
                attr_sel : row.attr_sel,
                attr_vals : row.attr_vals.join(' ')
            })
            if (res.meta.status !== 200) return this.$message.error('修改标签项失败！')
            this.$message.success('修改标签项成功！')
            console.log(res.data);
        },
        // 点击按钮展示 添加标签的文本框 
        showInput (attr) {
            attr.inputVisible = true
            // 自动获取焦点
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
                });
        },
        // 删除标签
        async handleClose (index, row) {
            // 删除操作
            row.attr_vals.splice(index, 1)
            this.saveAttrVals(row)
        }
    },
    // 计算属性
    computed: {
        // 如果按钮需要被禁用， 则返回true，反之false
        isBtnDisabled () {
            if (this.selectData.length !== 3) {
                return true
            }
            return false
        },
        // 获取级联选择器中的三级分类的id
        cateId () {
            // 级联选择器 选中到 三级分类
            if (this.selectData.length === 3) {
                // 返回三级分类的id
                return this.selectData[2]
            }
            // 否则返回一个null
            return null
        },
        // 动态计算标题文本
        titleText() {
            if (this.activeName === 'many') {
                return '动态参数'
            }
            else {
                return '静态参数'
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .select_opt {
        margin: 20px 0;
    }
    
    .el-tag {
        margin: 0 15px 8px 0;
    }
    
    .input-new-tag {
        width: 120px;
    }
</style>
