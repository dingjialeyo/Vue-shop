<template>
  <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮区域 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 角色列表区域 -->
        <el-table :data="rolesList" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand" width="60px" label="#">
                <template slot-scope="scope">
                    <el-row :class="['bdbotton', index1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一级权限 -->
                        <el-col :span="5">
                            <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二级和三级权限 -->
                        <el-col :span="19">
                            <!-- 通过for循环渲染二级权限 -->
                            <el-row v-for="(item2, index2) in item1.children" :key="item2.id" :class="['bdbotton', index2 === 0 ? '' : 'bdtop', 'vcenter']">
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="10">
                                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="序号" width="60px"></el-table-column>
            <!-- 第一列 -->
            <el-table-column label="角色名称" prop="roleName" ></el-table-column>
            <!-- 第二列 -->
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <!-- 第三列 -->
            <el-table-column label="操作">
                <!-- 自定义格式内容 -->
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button><el-button type="danger" icon="el-icon-delete" @click="rolesDel(scope.row.id)">删除</el-button><el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

        <!-- 添加角色的对话框 -->
        <el-dialog
            title="角色添加"
            :visible.sync="addRolesDialogVisible"
            width="50%"
            @close="addRolesDialogClose"
            >
            <!-- 内容区域 -->
            <el-form :model="addRoles" :rules="addRolessRules" ref="addRolesRef" label-width="90px" >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoles.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoles.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRolesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="ifAddRoles">确 定</el-button>  
            </span>
        </el-dialog>
        <!-- 角色编辑对话框 -->
        <el-dialog
            title="角色编辑"
            :visible.sync="putRolesDialogVisible"
            width="50%"
            @close="putRolesDialogClose"
            >
            <!-- 内容区域 -->
            <el-form :model="putRoles" :rules="putRolessRules" ref="putRolesRef" label-width="90px" >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="putRoles.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="putRoles.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="putRolesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="ifPutRoles">确 定</el-button>  
            </span>
        </el-dialog>
        <!-- 角色分配权限对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="setRightDialogClose"
            >
            <!-- 内容区域--树形结构 -->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <!-- 底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="ifRights">确 定</el-button>  
            </span>
        </el-dialog>
  </div>
</template>

<script>
export default {
    data () {
        return {
            // 获取到的角色列表数据
            rolesList: [],
            // 添加角色的对话框显示隐藏
            addRolesDialogVisible: false,
            // 添加角色对应的数据绑定
            addRoles: {
                roleName: '',
                roleDesc: ''
            },
            // 添加角色中的验证规则
            addRolessRules: {
                roleName: [
                    {
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 8,
                        message: '用户名的长度在2~8个字符之间',
                        trigger: 'blur'
                    }
                ],
                roleDesc: [
                    {
                        required: true,
                        message: '请输入角色描述',
                        trigger: 'blur'
                    }
                ]
            },
            // 编辑角色的对话框显示隐藏
            putRolesDialogVisible: false,
            // 获取编辑角色对应的数据绑定
            putRoles: {},
            // 角色编辑中的验证规则
            putRolessRules: {
                roleName: [
                    {
                        required: true,
                        message: '请填写角色名称',
                        trigger: 'blur'
                    },
                    
                ],
                roleDesc: [
                    {
                        required: true,
                        message: '请填写角色描述',
                        trigger: 'blur'
                    },
                ]
            },
            // 权限分配的对话框显示隐藏
            setRightDialogVisible: false,
            // 所有权限的数据
            rightsList : [],
            // 树形控件的属性绑定对象
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            // 默认选中的权限节点id值数组  通过三级权限的id
            defKeys: [],
            // 对应的分配权限的角色id
            roleId: '',
            

        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        async getRolesList () {
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.$message.error('获取角色列表数据失败！')
            this.rolesList = res.data
            console.log(this.rolesList);
        },
        addRolesDialogClose () {
            this.$refs.addRolesRef.resetFields()
        },
        // 确定添加角色的业务逻辑
        async ifAddRoles () {
            // 进行验证操作
            this.$refs.addRolesRef.validate(async valid => {
                // 验证不通过
                if(!valid) return
                // 发起请求
                const { data: res } = await this.$http.post('roles', this.addRoles)
                if (res.meta.status !== 201) return this.$message.error('角色添加失败！')
                this.$message.success('角色添加成功！')
                // 隐藏对话框
                this.addRolesDialogVisible = false
                // 重新渲染页面
                this.getRolesList()
            })
        },
        // 角色删除操作
        async rolesDel (id) {
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
            const { data: res} = await this.$http.delete(`roles/${id}`)
            if (res.meta.status !== 200) return this.$message.error('用户删除操作失败！')
            this.$message.success('用户删除操作成功！')
            this.getRolesList()
        },
        // 取消角色编辑的操作   y也就是重置操作
        putRolesDialogClose () {
            this.$refs.putRolesRef.resetFields()
        },
        // 角色编辑前先获取对应数据操作
        async showEditDialog (id) {
            const { data: res } = await this.$http.get(`roles/${id}`)
            if (res.meta.status !== 200) return this.$message.error('查询该角色数据失败！')
            this.putRoles = res.data
            console.log(this.putRoles);
            // 打开对应的对话框
            this.putRolesDialogVisible = true
        },
        // 角色编辑后的确定按钮操作
        ifPutRoles () {
            this.$refs.putRolesRef.validate(async valid => {
                if (!valid) return
                // 发送请求
                const { data: res } = await this.$http.put(`roles/${this.putRoles.roleId}`,{
                    roleName: this.putRoles.roleName,
                    roleDesc: this.putRoles.roleDesc
                })
                if (res.meta.status !== 200) return this.$message.error('编辑该角色失败！')
                this.putRolesDialogVisible = false
                this.getRolesList()
                this.$message.success('编辑该角色成功！')
            })
        },
        // 根据id删除对应的tag标签权限   role.id角色ID,rightId对应的权限id
        async removeRightById (role,rightId) {
            // 弹框询问确认删除  confirmResult布尔值
            const confirmResult = await this.$confirm('此操作将永久删除该标签权限, 是否继续?', 
            '提示', 
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => {return err})
            if (confirmResult !== 'confirm') return this.$message.info('成功取消删除操作！')
            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if (res.meta.status !== 200) return this.$message.error('该标签删除失败！')
            this.$message.success('该标签删除成功！')
            // 这样重新获取 会导致页面刷新
            // this.getRolesList()
            role.children = res.data
        },
        // 展示分配权限的对话框
        async showSetRightDialog (role) {
            this.roleId = role.id
            //获取所有权限的数据
            const { data: res } = await this.$http.get(`rights/tree`)
            if (res.meta.status !== 200) return this.$message.error('该角色的权限分配数据获取失败！')
            this.rightsList = res.data
            // console.log(this.rightsList);
            // 将选中的权限赋值给数组来显示
            console.log(role);
            this.getDefKeys(role, this.defKeys)
            this.setRightDialogVisible = true
        },
        // 通过递归获取三级id来绑定默认选中的权限
        getDefKeys (node, arr) {
            // 判断是否为三级权限  当node没有children属性说明为最后的三级权限
            if (!node.children) {
                // 将三级权限id push 到arr数组中
                return arr.push(node.id)
            }
            // 如果不是最后的三级权限将要递归出最后的三级权限
            node.children.forEach(item => {
                this.getDefKeys(item, arr)
            }
            )
        },
        // 监听分配权限对话框的关闭事件
        setRightDialogClose () {
            this.defKeys = []
        },
        // 为角色分配权限 --确定按钮 
        async ifRights () {
            // keys统计所有全选的和半选的id值
            const keys = [
                // 全选id值
                ...this.$refs.treeRef.getCheckedKeys(),
                // 半选id值
                ...this.$refs.treeRef.getHalfCheckedNodes()
            ]
            // console.log(keys)
            // 根据接口文档要求  将keys数组 转为以 逗号分隔的 字符串
            const idStr = keys.join(',')
            // console.log(idStr);
            // 拼接完后 发送请求
            const { data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{
                rids: idStr
            })
            if (res.meta.status !== 200) return this.$message.error('该角色分配权限失败！')
            this.setRightDialogVisible = false
            this.getRolesList()
            this.$message.success('该角色分配权限成功！')
        },
        
    },
}
</script>

<style>
.el-table {
    margin-top: 25px;
}
.el-tag {
    margin: 9px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbotton {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
