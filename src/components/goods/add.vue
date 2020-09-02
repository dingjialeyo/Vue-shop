<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!-- 提示区域 -->
            <el-alert
            title="添加商品信息"
            type="info"
            center
            show-icon>
            </el-alert>
            <!-- 步骤条 -->
            <!-- activeIndex -0 将字符串 转 数字类型 -->
            <el-steps :space="200" :active="activeIndex -0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- from表单区域 -->
            <el-form :model="addForm" :rules="addFromRules" ref="addFromRef" label-width="100px" label-position="top">
                <!-- tabs栏区域 
                v-model="activeIndex" 与上面的步骤条联动 都是通过索引来切换
            -->
                <el-tabs :tab-position="tabPosition" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClick">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price" type="number">
                        <el-input v-model="addForm.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight" type="number">
                        <el-input v-model="addForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number" type="number">
                        <el-input v-model="addForm.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <!-- 级联选择器 -->
                        <el-cascader
                            v-model="addForm.goods_cat"
                            :options="cateList"
                            :props="cateProps"
                            @change="handleChange"></el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <el-form-item :label="item.attr_name" v-for="item in manyDataList" :key="item.attr_id">
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox border :label="d" v-for="(d, i) in item.attr_vals" :key="i"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name" v-for="item in onlyDataList" :key="item.attr_id">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <!-- 图片上传区域 -->
                    <!-- 
                        action : 图片上传到某个api地址
                        on-preview : 上传后点击图片的预览事件
                        on-remove : 处理移除图片 事件
                        list-type : 上传后的 显示方式
                        on-success : 上传成功后 触发的事件
                    -->
                    <el-upload
                        :action="uploadURL"
                        :on-success="handleSuccess"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        list-type="picture"
                        :headers="headerObj">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <!-- 富文本编辑器 -->
                    <quill-editor v-model="addForm.goods_introduce">
                    </quill-editor>
                    <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
            </el-form>
            
        </el-card>
        <!-- 图片预览区域 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="图片预览" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
// 导入lodash 
import _ from 'lodash'
export default {
    data () {
        return {
            // 绑定步骤条的状态显示
            activeIndex : '0',
            // tabs栏标题显示位置
            tabPosition: 'left',
            // 添加商品的表单数据对象
            addForm: {
                //商品名称
                goods_name: '',
                // 商品价格
                goods_price: 0,
                // 商品重量
                goods_weight: 0,
                // 商品数量
                goods_number: 0,
                // 级联选择器的选中值
                goods_cat: [],
                // 图片数组
                pics : [],
                // 商品的详情描述
                goods_introduce: '',
                // 参数数组
                attrs : []
            },
            // 表单的验证规则
            addFromRules:{
                goods_name : [{
                    required: true,
                    message: '请输入商品名称',
                    trigger: 'blur'
                }],
                goods_price: [{
                    required: true,
                    message: '请输入商品价格',
                    trigger: 'blur'
                }],
                goods_weight: [{
                    required: true,
                    message: '请输入商品重量',
                    trigger: 'blur'
                }],
                goods_number: [{
                    required: true,
                    message: '请输入商品数量',
                    trigger: 'blur'
                }],
            },
            // 绑定获取过来的商品分类数据
            cateList: [],
            // 级联选择器的配置对象
            cateProps: { 
                expandTrigger: 'hover',
                // 显示的名称 
                label: 'cat_name', 
                value: 'cat_id', 
                // 二级菜单
                children: 'children' 
            },
            // 动态参数列表
            manyDataList : [],
            // 静态属性列表
            onlyDataList : [],
            // 图片上传的api地址
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
            // 图片上传所需的请求头设置
            headerObj : {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 对应完整的图片路径  ----预览需要
            previewPath: '',
            // 图片预览对话框的显示
            previewVisible : false,
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList () {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('商品分类数据获取失败！')
            this.cateList = res.data
            // console.log(this.cateList);
        },
        // 级联选择器发生变化触发
        handleChange () {
            console.log(this.addForm.goods_cat);
            if (this.addForm.goods_cat.length !== 3) {
                this.$message.info('必须选择三级商品分类！')
                this.addForm.goods_cat = []
                // console.log('ok');
            }
        },
        // tab页签  切换时 触发
        // activeName 点击的tab的name值  oldActiveName 原来处于的tab的name值
        beforeTabLeave (activeName,oldActiveName) {
            // console.log(activeName)
            // console.log(oldActiveName)
            if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('请先选择商品分类！')
                return false
            }
        },
        async tabClick () {
            // 点击对应的tab显示对应的值
            // console.log(this.activeIndex);
            // this.activeIndex值为1的话访问的是动态参数面板
            if (this.activeIndex === '1') {
                const { data : res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {
                        sel : 'many'
                    }
                })
                if (res.meta.status !== 200) return this.$message.error('动态参数获取失败！')
                res.data.forEach(item => {
                    // 将字符串以空格转为数组
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                })
                console.log(res.data)
                this.manyDataList = res.data
            }  
            // this.activeIndex值为2的话访问的是静态属性面板
            if (this.activeIndex === '2') {
                const { data :res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {
                        sel : 'only'
                    }
                })
                if (res.meta.status !== 200) return this.$message.error('静态属性获取失败！')
                console.log(res.data);
                this.onlyDataList = res.data
            }
        },
        // 处理图片预览 事件
        handlePreview (file) {
            // console.log(file);
            // 获取完整的图片路径
            this.previewPath = file.response.data.url
            // 显示图片预览对话框
            this.previewVisible = true
        },
        // 处理移除图片事件  file 该移除图片的信息
        handleRemove (file) {
            // console.log(file);
            // 1. 获取被删除图片的临时路径 
            const picPath = file.response.data.tmp_path
            // .2. 从查找pics数组中对应图片路径的索引值  返回的索引值picIndex
            const picIndex = this.addForm.pics.findIndex(item => {
                item.pic === picPath
            })
            // console.log(picIndex);
            // 3. 调用数组的 splice 方法 通过索引值 来删除 对应的 图片信息
            this.addForm.pics.splice(picIndex, 1)
            console.log(this.addForm);
        },
        // 监听图片上传成功时，触发的事件
        // response返回一个对象  有  --临时路径
        handleSuccess (response) {
            // console.log(response);
            // 1. 拼接得到图片信息对象
            const picInfo = {pic : response.data.tmp_path}
            // 2. 将图片信息对象 push 到 pics数组中
            this.addForm.pics.push(picInfo)
            console.log(this.addForm);
        },
        // 提交商品
        add () {
            // console.log(this.addForm);
            // 提交前的表单验证操作
            this.$refs.addFromRef.validate(async valid => {
                if (!valid) return this.$message.error('请填写必要的表单项！')
                // 验证成功后的操作
                // 需求： 将表单的分类等级以逗号分隔成字符串
                // 但是需要将addForm深拷贝一份，因为有些类型不让转换
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                // 需求：处理参数
                this.manyDataList.forEach(item => {
                    const newManyInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ')
                        }
                    this.addForm.attrs.push(newManyInfo)
                })
                this.onlyDataList.forEach(item => {
                    const newOnlyInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals
                    }
                    this.addForm.attrs.push(newOnlyInfo)
                })
                form.attrs = this.addForm.attrs
                console.log(form);
                // 发起请求
                const { data : res } = await this.$http.post('goods', form)
                if (res.meta.status !== 201) return this.$message.error('添加商品失败！')
                this.$message.success('商品添加成功！')
                // 重定向到goods路由
                this.$router.push('/goods')
            })
        }
    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[2]
            }
            return null
        }
    },
    
}
</script>

<style lang="less" scope>
    .el-checkbox {
        margin: 0 5px !important;
    }
    .previewImg {
        width: 100%;
    }
    .addBtn {
        margin-top: 15px !important;
    }
</style>