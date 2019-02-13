<template>
    <!-- 流程节点编辑 -->
    <el-dialog :visible="stepAddDialogConfig.show" :close-on-click-modal='false' custom-class="stepEditDialog" @close="closeDialog" v-drag>
        <span slot="title" style="color:#666666;">添加流程节点</span>

        <el-form label-width="200px" ref="orderHandupId" :model="stepaddConfig.form.data" :rules="stepaddConfig.form.rules" >
            <el-form-item label="节点名称 ：" prop="nodeName">
                <el-input v-model="stepaddConfig.form.data.nodeName"></el-input>
            </el-form-item>
            <el-form-item label="流程角色 ：" prop="role">
                <el-input v-model="stepaddConfig.form.data.role"></el-input>
            </el-form-item>
            <el-form-item label="是否拥有关闭工单权限 ：" prop="isCanCloseWorkOrder">
				<el-radio-group v-model="stepaddConfig.form.data.isCanCloseWorkOrder">
					<el-radio label="1">是</el-radio>
					<el-radio label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否可以退回 ：" prop="isCanReturn">
				<el-radio-group v-model="stepaddConfig.form.data.isCanReturn">
					<el-radio label="1">是</el-radio>
					<el-radio label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
        </el-form>
		
		

        <div slot="footer">
            <el-button type="primary" size="normal">保&nbsp;存</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
	props: ['stepAddDialogConfig'],
	data() {
		return {
			stepaddConfig: {
				form: {
					data:{
						nodeName: '',
						role: '',
						isCanCloseWorkOrder: '1',
						isCanReturn: '1'
						
					},
					rules: {
						nodeName: [
							{ required: true, message: '请输入节点名称', trigger: 'blur' }
						],
						role: [
							{ required: true, message: '请输入流程角色', trigger: 'blur' }
						],
						isCanCloseWorkOrder: [
							{ required: true, message: '请选择是否拥有关闭工单权限', trigger: 'blur' }
						],
						isCanReturn: [
							{ required: true, message: '请选择是否可以退回', trigger: 'blur' }
						],
					}
				}
			}
		}
	},
	methods: {
		closeDialog() {
			this.stepAddDialogConfig.show = false;
		}
	}
}
</script>

<style lang="less">
	.stepEditDialog{
		width: 460px;
		.el-form{
			padding:30px 30px 20px 20px;
		}
	}
</style>