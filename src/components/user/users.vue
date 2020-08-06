<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡牌视图区域 -->
        <el-card class="box-card">
            <!-- row布局 :span="7" 占比 24份  和Bootstrap一样    :gutter="20" 指的是 col之间的前后间隔-->
            <el-row :gutter="20">
                <el-col :span="7">
                    <!-- 搜索与添加区域 -->
                    <el-input placeholder="请输入内容" v-model="usersListParams.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域  :data 对应你获取的user列表  prop的值是user列表的属性名-->
            <el-table :data="usersList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index" label="序号" width="80px"></el-table-column>
                <!-- 第一列 -->
                <el-table-column label="姓名" prop="username" width="180px"></el-table-column>
                <!-- 第二列 -->
                <el-table-column label="邮箱" prop="email" width="180px"></el-table-column>
                <!-- 第三列 -->
                <el-table-column label="电话" prop="mobile" width="180px"></el-table-column>
                <!-- 第四列 -->
                <el-table-column label="角色" prop="role_name" width="180px"></el-table-column>
                <!-- 第五列 -->
                <el-table-column label="状态" width="180px">
                    <template slot-scope="scope">
                        <!-- 通过作用域插槽能获取到用户列表的数据 -->
                        <!-- {{scope.row}} -->
                        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="userState(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <!-- 第六列 -->
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUsers(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip class="item" effect="dark" content="角色分配" placement="right" :enterable="false">
                            <el-button @click="setRole(scope.row)" type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="usersListParams.pagenum"
                :page-sizes="[1,2,3]"
                :page-size="usersListParams.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog
            title="用户添加"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClose"
            >
            <!-- 内容区域 -->
            <el-form :model="addUsers" :rules="addUsersRules" ref="addUsersRef" label-width="70px" >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUsers.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUsers.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUsers.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="addUsers.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="ifAddUsers">确 定</el-button>  
            </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog
            title="用户修改"
            :visible.sync="putDialogVisible"
            width="50%"
            @close="putDialogClose"
            >
            <!-- 内容区域 -->
            <el-form :model="putUsers" :rules="putUsersRules" ref="putUsersRef" label-width="70px" >
                <el-form-item label="用户名">
                    <el-input v-model="putUsers.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="putUsers.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="putUsers.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="putDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="isPutUsers">确 定</el-button>  
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="setRoleVisible"
            width="50%"
            @close="setRoleDialogClose"
            >
            <div>
                <p>当前的用户: {{roleInfo.username}}</p>
                <p>当前的角色: {{roleInfo.role_name}}</p>
                <p>分配新角色: 
                    <template>
                        <el-select v-model="selectRoleId" placeholder="请选择">
                            <el-option
                            v-for="item in roleList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </p>
            </div>
            <!-- 底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="isSetRole">确 定</el-button>  
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        // bug
            // 自定义的邮箱验证规则
            // var checkEmail = (rule, value, callback) => {
            //     // 验证邮箱的正则
            //     const regEmail = /^([a-zA-Z0-9_-])+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-])+/

            //     if (regEmail.test(value)) {
            //         // 符合正则
            //         return callback()
            //     }
            //     callback(new Error('请输入合法的邮箱'))
            // },

            // // 自定义的手机号验证贵州
            // var checkMobile = (rule, value, callback) => {
            //     // 验证手机号的正则
            //     const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]18[0-9]|14[57])[0-9]{8}$/

            //     if (regMobile.test(value)) {
            //         // 符合正则
            //         return callback()
            //     }
            //     callback(new Error('请输入合法的手机号'))
            // }
        return {
            // 发送请求用户列表的参数
            usersListParams: {
                // 用于搜索关键字
                query: '',
                // 当前页数
                pagenum: 1,
                // 当前每页显示多少数据
                pagesize: 2
            },
            // 接收到的用户列表数据
            usersList: [],
            total: 0,
            // 控制添加用户对话框的显示隐藏
            addDialogVisible: false,
            // 控制修改用户对话框的显示隐藏
            putDialogVisible: false,
            // 添加用户的数据
            addUsers: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加用户的验证规则
            addUsersRules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 8,
                        message: '用户名的长度在2~8个字符之间',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 15,
                        message: '密码的长度在6~15个字符之间',
                        trigger: 'blur'
                    }
                ],
                email: [
                    {
                        required: true,
                        message: '请填写邮箱',
                        trigger: 'blur'
                    },
                    // 自定义验证
                    // {
                    //     validator: checkEmail,
                    //     trigger: 'blur'
                    // }
                ],
                mobile: [
                    {
                        required: true,
                        message: '请填写手机号',
                        trigger: 'blur'
                    },
                    // 自定义验证
                    // {
                    //     validator: checkMobile,
                    //     trigger: 'blur'
                    // }
                ]
            },
            // 修改用户的验证规则
            putUsersRules: {
                email: [
                    {
                        required: true,
                        message: '请填写邮箱',
                        trigger: 'blur'
                    },
                    // 自定义验证
                    // {
                    //     validator: checkEmail,
                    //     trigger: 'blur'
                    // }
                ],
                mobile: [
                    {
                        required: true,
                        message: '请填写手机号',
                        trigger: 'blur'
                    },
                ]
            },
            // 获取的 要修改用户的数据
            putUsers: {},
            // 分配角色对话框的显示隐藏
            setRoleVisible: false,
            // 点击后对应该角色的信息
            roleInfo : {},
            // 获取所有角色列表数据
            roleList : [],
            // 分配角色对话框中的选择角色获取的值
            selectRoleId : ''
        }
    },
    // 生命周期
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList () {
            // 传递过去的参数params
            const { data: res} = await this.$http.get('users', {params: this.usersListParams})
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
            this.usersList = res.data.users
            this.total = res.data.total
            console.log(this.usersList)
        },
        // 监听每页显示数量的改变  当前点击的页码中的数据数量newSize
        handleSizeChange (newSize) {
            // console.log(newSize)
            this.usersListParams.pagesize = newSize
            // 通过改变 发送请求用户列表的参数 中的 pagesize 来重新获取用户列表
            this.getUserList()
        },
        // 监听 页码值 的改变   newPage当前点击的页码值
        handleCurrentChange (newPage) {
            // console.log(newPage)
            this.usersListParams.pagenum = newPage
            this.getUserList()
        },
        // 监听switch开关   用户状态的改变 
        async userState (users) {
            console.log(users.mg_state);
            // 修改用户状态
            const {data : res} = await this.$http.put(`users/${users.id}/state/${users.mg_state}`)
            if (res.meta.status !== 200) {
                users.mg_state = !users.mg_state
                return this.$message.error('用户状态修改错误！')
            }
            this.$message.success('用户状态修改成功！')
        },
        // 添加用户的关闭事件   resetFields()重置数据
        addDialogClose () {
            this.$refs.addUsersRef.resetFields()
        },
        // 确定按钮 --添加用户
        ifAddUsers () {
            // 进行验证操作
            this.$refs.addUsersRef.validate(async valid => {
                if(!valid) return
                // 发起添加请求
                const {data : res} = await this.$http.post('users', this.addUsers)

                if(res.meta.status !== 201) return this.$message.error('用户添加失败！')
                this.$message.success('用户添加成功')
                // 隐藏对话框
                this.addDialogVisible = false
                // 重新获取用户列表数据
                this.getUserList()
            })
        },
        // 修改用户的对话框显示 并通过id获取当前用户数据
        async showEditDialog (id) {
            // console.log(id);
            const { data: res} = await this.$http.get(`users/${id}`)
            if (res.meta.status !==200) return this.$message.error('查询该用户数据失败')
            this.putUsers = res.data
            // console.log(this.putUsers);
            this.putDialogVisible = true
        },
        // 修改用户的关闭按钮事件  重置表单操作
        putDialogClose () {
            this.$refs.putUsersRef.resetFields()
        },
        // 确定按钮 --修改用户
        isPutUsers () {
            this.$refs.putUsersRef.validate(async valid => {
                if (!valid) return
                // 发起修改请求
                const { data: res} = await this.$http.put(`users/${this.putUsers.id}`,{
                    email: this.putUsers.email,
                    mobile: this.putUsers.mobile
                })
                if (res.meta.status !== 200) {
                    return this.$http.message.error('用户修改失败！')
                }
                else {
                    this.putDialogVisible = false
                    this.getUserList()
                    this.$message.success('用户修改成功！')
                }
            })
        },
        // 删除用户操作
        async delUsers (id) {
            // 弹框询问确认删除  confirmResult布尔值
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', 
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
            const { data: res} = await this.$http.delete(`users/${id}`)
            if (res.meta.status !== 200) return this.$message.error('用户删除操作失败！')
            this.$message.success('用户删除操作成功！')
            this.getUserList()
        },
        // 打开角色分配对话框 并获取响应数据
        async setRole (roleInfo) {
            this.roleInfo = roleInfo
            // 在展示对话框前，获取所有的角色列表
            const { data : res} = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.$message.error('获取角色列表数据失败！')
            this.roleList = res.data
            this.setRoleVisible = true
        },
        // 关闭分配角色对话框
        setRoleDialogClose () {
            // 重置对应的数据信息
            this.selectRoleId = ''
            this.roleInfo = {}
            this.setRoleVisible = false
        },
        // 确定点击 分配选择后的角色
        async isSetRole () {
            if(!this.selectRoleId) {
                return this.$message.error('请选择分配的新角色！')
            }
            const { data: res} = await this.$http.put(`users/${this.roleInfo.id}/role`,{
                rid : this.selectRoleId
            })
            if (res.meta.status !== 200) return this.$message.error('分配新角色操作失败！')
            this.getUserList()
            this.setRoleVisible = false
            this.$message.success('分配新角色操作成功！')
        }
    }
}
</script>

<style lang="less" scoped>
</style>